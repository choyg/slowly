import {
  IRouter,
  NextFunction,
  Request,
  Response,
  RequestHandler,
  Router,
} from "express";
import "reflect-metadata";
import { Container, DefaultContainer } from "./container";
import { ControllerMethods, Controllers } from "./decorators/state";
import { ArgType, LoaderOptions, Route, DefaultLoaderOptions } from "./types";
import { resolvePath } from "./utils/resolveUrl";
import { Validator } from "./validator";

export default class {
  private readonly prototypes: Set<Object>;
  private readonly middleware: RequestHandler[] = [];
  private readonly options: LoaderOptions;
  private validator?: Validator;
  private container: Container;
  readonly routes: Route[] = [];

  getState() {
    return {
      controllers: Controllers,
      methods: ControllerMethods,
    };
  }

  setContainer(container: Container) {
    this.container = container;
  }

  setValidator(validator: Validator) {
    this.validator = validator;
  }

  constructor(options: LoaderOptions) {
    this.options = {
      ...DefaultLoaderOptions,
      ...options,
    };
    this.prototypes = new Set(
      this.options.controllers.map((constructor) => constructor.prototype)
    );
    this.container = this.options.container || new DefaultContainer();
    this.validator = this.options.validator;
    this.init();
  }

  private init() {
    for (const [proto, methods] of ControllerMethods.entries()) {
      // Decorators will execute on import but
      // only load explicitly specified controllers.
      if (!this.prototypes.has(proto)) {
        continue;
      }
      for (const [methodName, method] of methods) {
        const controller = Controllers.get(proto);
        if (!controller) {
          throw new Error(
            `No class controller registered for method '${String(
              methodName
            )}'` + ` at route ${method.route}`
          );
        }

        const path = resolvePath(controller.route, method.route);
        const args = method.args.sort((a, b) => a.index - b.index);

        this.routes.push({
          method,
          args,
          path,
          constructor: proto.constructor,
          prototype: proto,
        });
      }
    }
  }

  private async getMethod(route: Route) {
    const instance = this.container.get<any>(route.constructor);
    if (!instance) {
      throw new Error(
        `Container did not return an object for '${route.constructor.name}'`
      );
    }
    const method = instance[route.method.name];
    if (method == null) {
      throw new Error(
        `Cannot find method '${route.method.name}' in '${route.constructor.name}'`
      );
    }
    if (typeof method !== "function") {
      throw new Error(
        `Found method '${route.method.name}' but is not a function.`
      );
    }

    return method.bind(instance);
  }

  private getArgs(req: Request, res: Response, { args, constructor }: Route) {
    const argList: any[] = [];
    let customRes = false;
    args.forEach((arg) => {
      if (argList.length < arg.index) {
        const delta = arg.index - argList.length;
        argList.push(...new Array(delta).fill(undefined));
      }
      // TODO move validation step into middleware
      switch (arg.type) {
        case ArgType.REQ:
          return argList.push(req);
        case ArgType.RES:
          customRes = true;
          return argList.push(res);
        case ArgType.PARAMS:
          if (this.validator) {
            req.params = this.validator.validate({
              constructor,
              data: req.params,
              req: req,
              paramMeta: arg.options,
              argType: "params",
            });
          }
          return argList.push(req.params);
        case ArgType.QUERYPARAMS:
          if (this.validator) {
            req.query = this.validator.validate({
              constructor,
              data: req.query,
              req: req,
              paramMeta: arg.options,
              argType: "queryparams",
            });
          }
          return argList.push(req.query);
        case ArgType.BODY:
          if (this.validator) {
            req.body = this.validator.validate({
              constructor,
              data: req.body,
              req: req,
              paramMeta: arg.options,
              argType: "body",
            });
          }
          return argList.push(req.body);
      }
    });

    return {
      args: argList,
      customRes,
    };
  }

  /**
   * Add middleware to run before each route.
   * The req object will contain metadata set on the route method.
   * For example, `@Get('/', { foo: 'bar' })` will populate `req.metadata` with
   * the Object `{ foo: 'bar' }`.
   * @param middleware One or more middleware functions
   */
  use(...middleware: RequestHandler[]) {
    this.middleware.push(...middleware);
  }

  useExpress(router: IRouter) {
    this.routes.forEach((route) => {
      router[route.method.action](
        route.path,
        async (req: Request, res: Response, next: NextFunction) => {
          (req as any)[this.options.metadataProperty!] = route.method.metadata;
          next();
        },
        ...this.middleware,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const { args, customRes } = this.getArgs(req, res, route);
            const method = await this.getMethod(route);
            const response = await method(...args);

            // If the user injected @Res, they must send a response themselves
            if (customRes) {
              return;
            }

            if (response != null) {
              res.json(response);
            } else {
              res.sendStatus(204);
            }
          } catch (err) {
            // Pass errors to Express default error handler
            // Allows users to define error handler outside of library
            next(err);
          }
        }
      );
    });
  }
}
export * from "./decorators";
export * from "./errors";
export * from "./validator";
export { Container } from "./container";
export { MethodMetadata } from "./types";
