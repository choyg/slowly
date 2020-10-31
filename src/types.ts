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
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH,
}

export interface ControllerData {
  route: string;
  constructor: Function;
}

export interface ParamMeta {
  index: number;
}

export type MethodName = string | symbol;
