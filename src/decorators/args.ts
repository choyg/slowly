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

export const Req = BaseArg(ArgType.REQ);
export const Res = BaseArg(ArgType.REQ);
export const Body = BaseArg(ArgType.REQ);
export const Param = BaseArg(ArgType.REQ);
export const Headers = BaseArg(ArgType.REQ);
