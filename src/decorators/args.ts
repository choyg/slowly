import { ArgType, MethodName } from "../types";
import { addArg } from "./state";

const BaseArg = (type: ArgType) => () => (
  prototype: Object,
  method: MethodName,
  parameterIndex: number
) => {
  addArg(prototype, method, {
    index: parameterIndex,
    type,
  });
};

export const Params = (constructor: Function) => (
  prototype: Object,
  method: MethodName,
  parameterIndex: number
) => {
  addArg(prototype, method, {
    index: parameterIndex,
    type: ArgType.PARAMS,
    options: constructor,
  });
};

export const Req = BaseArg(ArgType.REQ);
export const Res = BaseArg(ArgType.RES);
export const Body = BaseArg(ArgType.BODY);
export const Param = BaseArg(ArgType.PARAM);
export const Header = BaseArg(ArgType.HEADER);
