import { ArgType, MethodName } from "../types";
import { addArg } from "./state";

const BaseArg = (type: ArgType) => () => (
  prototype: Object,
  method: MethodName,
  parameterIndex: number
) => {
  const paramType = Reflect.getMetadata("design:paramtypes", prototype, method);
  addArg(prototype, method, {
    index: parameterIndex,
    type,
    options: paramType[parameterIndex],
  });
};

export const Req = BaseArg(ArgType.REQ);
export const Res = BaseArg(ArgType.RES);
export const Body = BaseArg(ArgType.BODY);
export const Params = BaseArg(ArgType.PARAMS);
export const QueryParams = BaseArg(ArgType.QUERYPARAMS);
export const Header = BaseArg(ArgType.HEADER);
