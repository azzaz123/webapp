import { Pipe, PipeTransform } from '@angular/core';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FilterConfig } from '../../../interfaces/filter-config.interface';

@Pipe({
  name: 'filterValues',
})
export class FilterValuesPipe implements PipeTransform {
  transform(values: FilterParameter[], config: FilterConfig<unknown>): FilterParameter[] {
    const paramKeys = Object.keys(config.mapKey).map((key) => config.mapKey[key]);
    return values.filter((param) => paramKeys.includes(param.key));
  }
}
