import { Pipe, PipeTransform } from '@angular/core';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { CategoriesFilterOption } from '../interfaces/categories-filter-option.interface';

@Pipe({ name: 'formatSelectOptions' })
export class FormatSelectOptionsPipe implements PipeTransform {
  transform(options: CategoriesFilterOption[]): SelectFormOption<string>[] {
    return options.map((option) => ({
      ...option,
      icon: option.icon.stroke,
    }));
  }
}
