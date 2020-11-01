import { IRouter, Request, Response } from "express";
import { Container, DefaultContainer } from "./container";
import {
  ControllerMethods,
  Controllers,
  MethodStore,
} from "./decorators/state";
import { ArgStore, ArgType } from "./types";
import { resolvePath } from "./utils/resolveUrl";
import { getStatusCode } from "./utils/statusCode";

export interface LoaderOptions {
  controllers: Function[];
  container?: Container;
  onError?: (err: Error) => void | Promise<void>;
}
export default class {
  private readonly container: Container;
  private readonly prototypes: Set<Object>;
  private readonly routes: Route[] = [];
  constructor(private readonly options: LoaderOptions) {
    this.prototypes = new Set(
      options.controllers.map((constructor) => constructor.prototype)
    );
    this.container = options.container || new DefaultContainer();
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

  private getArgs(req: Request, res: Response, { args }: Route) {
    const argList: any[] = [];
    args.forEach((arg) => {
      if (argList.length < arg.index) {
        const delta = arg.index - argList.length;
        argList.push(...new Array(delta).fill(undefined));
      }
      switch (arg.type) {
        case ArgType.REQ:
          return argList.push(req);
        case ArgType.RES:
          return argList.push(res);
      }
    });

    return argList;
  }

  useExpress(router: IRouter) {
    this.routes.forEach((route) => {
      (router as any)[route.method.action.toString()](
        route.path,
        async (req: Request, res: Response) => {
          try {
            const args = this.getArgs(req, res, route);
            const method = await this.getMethod(route);
            const response = await method(...args);
            if (response != null) {
              res.json(response);
            } else {
              res.sendStatus(204);
            }
          } catch (err) {
            res.status(getStatusCode(err.statusCode));
            if (err.data) {
              res.json(err.data);
            } else {
              res.sendStatus(500);
            }
            if (this.options.onError) {
              this.options.onError.call(this.options.onError, err);
            }
          }
        }
      );
    });
  }
}

interface Route {
  prototype: Object;
  constructor: Function;
  path: string;
  method: MethodStore;
  args: ArgStore[];
}
