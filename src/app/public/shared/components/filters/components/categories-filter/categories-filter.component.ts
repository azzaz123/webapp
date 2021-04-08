import { Component } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { CategoriesFilterParams } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-params.interface';

@Component({
  selector: 'tsl-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss'],
})
export class CategoriesFilterComponent extends AbstractFilter<CategoriesFilterParams> {}
