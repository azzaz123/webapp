import * as debounceFn from 'lodash.debounce';

export function debounce(milliseconds: number = 0, options = {}): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = debounceFn(originalMethod, milliseconds, options);
    return descriptor;
  };
}
