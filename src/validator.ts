export interface Validator {
  validate: (constructor: Function, data: Object) => boolean;
}
