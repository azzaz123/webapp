import { Observable, Subject } from 'rxjs';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';

export class FilterGroup {
  private _valueChange = new Subject<FilterParameter[]>();
  private _openStateChange = new Subject<boolean>();

  constructor(private filters: AbstractFilter<unknown>[]) {
    this.bindChangesListener();
  }

  public valueChange(): Observable<FilterParameter[]> {
    return this._valueChange.asObservable();
  }

  public openStateChange(): Observable<boolean> {
    return this._openStateChange.asObservable();
  }

  private bindChangesListener(): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      filter.valueChange.subscribe((value: FilterParameter[]) => {
        this._valueChange.next(value);
      });

      filter.openStateChange.subscribe((isOpen: boolean) => {
        this._openStateChange.next(isOpen);
      });
    });
  }
}
