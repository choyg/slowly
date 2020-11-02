import { ArgStore, ControllerData, HttpAction, MethodName } from "../types";

export const Controllers = new Map<Object, ControllerData>();
export const ControllerMethods = new Map<
  Object,
  Map<MethodName, MethodStore>
>();
export const Schemas = new Set<Function>();

export const addMethod = (
  proto: Object,
  route: string,
  action: HttpAction,
  name: string
) => {
  const controller =
    ControllerMethods.get(proto) || new Map<MethodName, MethodStore>();
  const method = controller.get(name) || new MethodStore();
  method.action = action;
  method.name = name;
  method.route = route;
  controller.set(name, method);
  ControllerMethods.set(proto, controller);
};

export const addArg = (
  proto: Object,
  methodName: MethodName,
  param: ArgStore
) => {
  const controller =
    ControllerMethods.get(proto) || new Map<string, MethodStore>();
  const method = controller.get(methodName) || new MethodStore();
  method.args.push(param);
  controller.set(methodName, method);
  ControllerMethods.set(proto, controller);
};

export const addSchema = (constructor: Function) => {
  Schemas.add(constructor);
};

export class MethodStore {
  route!: string;
  name!: string;
  args: ArgStore[] = [];
  action!: HttpAction;
}
