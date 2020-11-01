export interface Container {
  get: <T>(token: Function) => T;
}

export class DefaultContainer implements Container {
  get(constructor: Function) {
    return new (constructor as any)();
  }
}
