import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';
import { Directive, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class AbstractFilter<T extends Record<keyof T, string>> implements Filter<T>, OnInit {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: FilterConfig<T>;

  @Input()
  set value(value: FilterParameter[]) {
    const previousValue = this._value;
    this.writeValue(value);
    this.onValueChange(previousValue, value);
  }

  get value(): FilterParameter[] {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<FilterParameter[]>();
  @Output() clear = new EventEmitter<void>();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;

  public label: string;
  protected _value: FilterParameter[] = [];

  protected hasValueSubject = new BehaviorSubject<boolean>(false);

  public hasValue$(): Observable<boolean> {
    return this.hasValueSubject.asObservable();
  }

  protected _hasValue(): boolean {
    return this._value?.length > 0;
  }

  public ngOnInit(): void {
    this.label = this.config.bubblePlaceholder;
    this._value = this._value?.length ? this._value : this.config.defaultValue || [];
  }

  public writeValue(value: FilterParameter[]): void {
    this._value = [...value];
    this.hasValueSubject.next(this._hasValue());
  }

  public getFilterCounter(): number | undefined {
    return this._value.length > 1 ? this._value.length : undefined;
  }

  public handleApply(): void {
    this.valueChange.emit(this._value);
  }

  public handleClear(): void {
    this.clear.emit();
  }

  public handleOpenStateChange(isOpen: boolean): void {
    this.openStateChange.emit(isOpen);
  }

  public getValue(key: keyof T): string {
    return this._value?.find((parameter: FilterParameter) => parameter.key === this.config.mapKey[key])?.value;
  }

  public hasValueChanged(previous: FilterParameter[], current: FilterParameter[]): boolean {
    const keys = Object.keys(this.config.mapKey);

    if (!previous && !current) {
      return false;
    } else if (!previous) {
      return true;
    } else {
      for (const key of keys) {
        const paramKey = this.config.mapKey[key];
        const previousValue = previous.find((parameter: FilterParameter) => parameter.key === paramKey)?.value;
        const currentValue = current.find((parameter: FilterParameter) => parameter.key === paramKey)?.value;

        if (previousValue !== currentValue) {
          return true;
        }
      }
    }

    return false;
  }

  public abstract onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void;
}
