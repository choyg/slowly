import { Container } from "./container";
import { MethodStore } from "./decorators/state";
import { Validator } from "./validator";

export interface ArgStore {
  type: ArgType;
  index: number;
  options?: any;
}

export enum ArgType {
  REQ = "req",
  RES = "res",
  BODY = "body",
  PARAM = "param",
  PARAMS = "params",
  HEADER = "header",
  QUERYPARAMS = "queryparams",
}

export enum HttpAction {
  GET = "get",
  HEAD = "head",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  CONNECT = "connect",
  OPTION = "option",
  TRACE = "trace",
  PATCH = "patch",
  ALL = "all",
}

export interface ControllerData {
  route: string;
  constructor: Function;
}

export interface ParamMeta {
  index: number;
}

export type MethodName = string | symbol;

export interface Route {
  prototype: Object;
  constructor: Function;
  path: string;
  method: MethodStore;
  args: ArgStore[];
}

export interface LoaderOptions {
  controllers: Function[];
  container?: Container;
  validator?: Validator;
  /**
   * The property to attach request metadata to on the `req` object.
   * @default metadata req.metadata
   */
  metadataProperty?: string;
}

export const DefaultLoaderOptions: LoaderOptions = {
  controllers: [],
  metadataProperty: "metadata",
};

export interface MethodMetadata {}

export const DefaultMethodOptions: MethodMetadata = {};
