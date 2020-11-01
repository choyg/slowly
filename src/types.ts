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
