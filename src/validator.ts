import { Request } from "express";

export interface Validator {
  validate: (arg: ValidateArg) => boolean;
}

export interface ValidateArg {
  req: Request;
  constructor: Function;
  data: Object;
  paramMeta: Function;
  argType: "header" | "params" | "queryparams" | "body";
}
