import { Subject } from 'rxjs';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';

export class FilterGroup {
  public valueChange = new Subject();

  constructor(private filters: AbstractFilter<unknown>[]) {
    this.bindChangesListener();
  }

  private bindChangesListener(): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      filter.valueChange.subscribe((value: FilterParameter) => {
        this.valueChange.next(value);
      });
    });
  }
}
