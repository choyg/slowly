import { Request } from "express";

export interface Validator {
  /**
   * Return validated data
   * If the input is invalid, you should throw an error with the appropriate status code
   * such as `throw new HttpError(400)`
   */
  validate: (arg: ValidateArg) => any;
}

export interface ValidateArg {
  req: Request;
  constructor: Function;
  data: Object;
  paramMeta: Function;
  argType: "header" | "params" | "queryparams" | "body";
}
