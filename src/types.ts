export interface ArgStore {
  type: ArgType;
  index: number;
}

export enum ArgType {
  REQ,
  RES,
  BODY,
  PARAM,
  HEADERS,
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
