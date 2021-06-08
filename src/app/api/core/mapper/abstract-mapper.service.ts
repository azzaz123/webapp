import { MapperService } from './mapper-service.interface';

export abstract class AbstractMapperService<S, T, A extends Array<unknown> = never> implements MapperService<S, T, A> {
  protected abstract map(entity: S, ...args: unknown[]): T;

  transform(entity: S, ...args: A): T;
  transform(array: S[], ...args: A): T[];
  transform(entityOrArray: S | S[], ...args: A): T | T[] {
    return Array.isArray(entityOrArray) ? entityOrArray.map((item: S) => this.map(item, ...args)) : this.map(entityOrArray, ...args);
  }
}
