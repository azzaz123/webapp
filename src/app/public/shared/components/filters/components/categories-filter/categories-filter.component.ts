import { Component } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { CategoriesFilterParams } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-params.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> {
  public VARIANT = FILTER_VARIANT;
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  public getGridOptions(): GridSelectFormOption[] {
    return [];
  }

  public getSelectOptions(): SelectFormOption<string>[] {
    return [];
  }

  public getLabel(): string {
    return 'label';
  }

  public getIcon(): string {
    return this.config.icon;
  }
}
