export interface MapperService<S, T, A extends Array<unknown>> {
  transform(entity: S, ...args: A): T;
  transform(array: S[], ...args: A): T[];
  transform(entityOrArray: S | S[], ...args: A): T | T[];
}
