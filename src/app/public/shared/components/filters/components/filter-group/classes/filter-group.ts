import { Observable, Subject } from 'rxjs';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';

export class FilterGroup {
  private _valueChange = new Subject<FilterParameter[]>();
  private _openStateChange = new Subject<boolean>();
  private _clear = new Subject<FilterParameter[]>();

  constructor(private filters: AbstractFilter<unknown>[]) {
    this.bindChangesListener();
  }

  public valueChange(): Observable<FilterParameter[]> {
    return this._valueChange.asObservable();
  }

  public getValue(): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      console.log('getValue', filter.value);
    });
  }

  public setValue(value: FilterParameter[]): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      const mapKeys = Object.keys(filter.config.mapKey);
      const values: FilterParameter[] = [];
      mapKeys.forEach((mapKey: string) => {
        const filterParameter = value.find((parameter: FilterParameter) => parameter.key === filter.config.mapKey[mapKey]);
        if (filterParameter) {
          values.push(filterParameter);
        }

        filter.value = values;
      });
    });
  }

  public openStateChange(): Observable<boolean> {
    return this._openStateChange.asObservable();
  }

  public clear(): Observable<FilterParameter[]> {
    return this._clear.asObservable();
  }

  private bindChangesListener(): void {
    this.filters.forEach((filter: AbstractFilter<unknown>) => {
      filter.valueChange.subscribe((value: FilterParameter[]) => {
        this._valueChange.next(value);
      });

      filter.openStateChange.subscribe((isOpen: boolean) => {
        this._openStateChange.next(isOpen);
      });

      filter.clear.subscribe(() => {
        this._clear.next(filter.value);
      });
    });
  }
}
