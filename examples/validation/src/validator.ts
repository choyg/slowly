import Ajv from "ajv";
import { HttpError, ValidateArg, Validator } from "slowtify";
export class JsonSchemaValidator implements Validator {
  constructor(private readonly ajv: Ajv) {}

  validate(arg: ValidateArg) {
    const isValid = this.ajv.validate(arg.paramMeta.name, arg.data);
    if (isValid) {
      return arg.data;
    }

    throw new HttpError(400, this.ajv.errorsText(this.ajv.errors));
  }
}
