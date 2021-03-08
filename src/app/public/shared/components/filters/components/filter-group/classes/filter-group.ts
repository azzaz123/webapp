import { Observable, Subject } from 'rxjs';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';

export class FilterGroup {
  private _valueChange = new Subject<FilterParameter[]>();

  constructor(private filters: AbstractFilter<unknown>[]) {
    this.bindChangesListener();
  }

  public valueChange(): Observable<FilterParameter[]> {
    return this._valueChange.asObservable();
  }

  private bindChangesListener(): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      filter.valueChange.subscribe((value: FilterParameter[]) => {
        this._valueChange.next(value);
      });
    });
  }
}
