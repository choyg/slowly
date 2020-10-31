import { IRouter, Request, Response } from "express";
import { ControllerMethods, Controllers } from "./decorators/state";

export interface LoaderOptions {
  controllers: Function[];
  router: IRouter;
}
export const loadRoutes = async (options: LoaderOptions) => {
  // Construct paths
  for (const [proto, methods] of ControllerMethods.entries()) {
    for (const [methodName, method] of methods) {
      const controller = Controllers.get(proto);
      console.log(controller);
      if (!controller) {
        throw new Error(
          `No class controller found for method '${String(methodName)}'` +
            ` at route ${method.route}`
        );
      }

      let url = controller.route;
      if (
        !controller.route.endsWith("/") &&
        !method.route.startsWith("/") &&
        method.route !== ""
      ) {
        url = url.concat("/");
      } else if (
        controller.route.endsWith("/") &&
        method.route.startsWith("/")
      ) {
        url = url.slice(0, url.length - 1);
      }
      url = url.concat(method.route);

      (options.router as any)[method.action.toString().toLowerCase()](
        url,
        (req: Request, res: Response) => {
          res.sendStatus(201);
        }
      );
    }
  }
};
