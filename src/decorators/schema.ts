import { addSchema } from "./state";

export const Schema = () => (constructor: Function) => {
  addSchema(constructor);
};
