export interface MapperService<S, T> {
  transform(entity: S): T;
  transform(array: S[]): T[];
  transform(entityOrArray: S | S[]): T | T[];
}
