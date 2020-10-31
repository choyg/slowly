import { Controllers } from "./state";

export const Controller = (route: string = "") => (constructor: Function) => {
  Controllers.set(constructor.prototype, {
    route,
    constructor,
  });
};
