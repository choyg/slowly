import { HttpAction, MethodMetadata } from "../types";
import { addMethod } from "./state";

const BaseMethod = (action: HttpAction) => (
  route: string = "",
  options: MethodMetadata = {}
) => (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  addMethod(target, route, action, methodName, options);
};

export const All = BaseMethod(HttpAction.ALL);
export const Get = BaseMethod(HttpAction.GET);
export const Head = BaseMethod(HttpAction.HEAD);
export const Post = BaseMethod(HttpAction.POST);
export const Put = BaseMethod(HttpAction.PUT);
export const Delete = BaseMethod(HttpAction.DELETE);
export const Connect = BaseMethod(HttpAction.CONNECT);
export const Options = BaseMethod(HttpAction.OPTIONS);
export const Trace = BaseMethod(HttpAction.TRACE);
export const Patch = BaseMethod(HttpAction.PATCH);
