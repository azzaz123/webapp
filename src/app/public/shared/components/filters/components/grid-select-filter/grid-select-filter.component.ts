import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { GridSelectFilterParams } from './interfaces/grid-select-filter-params.interface';
import { GridSelectFilterConfig } from './interfaces/grid-select-filter-config.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { take } from 'rxjs/operators';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-grid-select-filter',
  templateUrl: './grid-select-filter.component.html',
  styleUrls: ['./grid-select-filter.component.scss'],
})
export class GridSelectFilterComponent extends AbstractFilter<GridSelectFilterParams> implements OnInit, OnDestroy {
  @Input() config: GridSelectFilterConfig;

  private labelSubject = new BehaviorSubject<string>('');
  private iconSubject = new BehaviorSubject<string>('');
  private subscriptions = new Subscription();

  public options: GridSelectFormOption[] = [];
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });
  public label$ = this.labelSubject.asObservable();
  public icon$ = this.iconSubject.asObservable();

  constructor(private optionService: FilterOptionService) {
    super();
  }

  public ngOnInit(): void {
    this.initForm();
    this.updateLabel();
    this.updateIcon();
    this.optionService
      .getOptions(this.config.id)
      .pipe(take(1))
      .subscribe(({ list }) => {
        this.options = list as GridSelectFormOption[];
        this.updateLabel();
        this.updateIcon();
      });
    super.ngOnInit();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    this.updateForm();
    this.updateLabel();
    this.updateIcon();
  }

  public handleApply() {
    const value = this.formGroup.controls.select.value;
    if (value.length) {
      this.handleValueChange(value);
      super.handleApply();
    } else {
      this.handleClear();
    }
  }

  public handleClear() {
    super.handleClear();
    this.updateForm();
    this.updateLabel();
    this.updateIcon();
  }

  private handleValueChange(value: string[]): void {
    this.writeValue(this.formatValue(value));
    this.updateLabel();
    this.updateIcon();
  }

  private initForm(): void {
    if (this.variant === FILTER_VARIANT.CONTENT) {
      const subscription = this.formGroup.controls.select.valueChanges.subscribe((value) => {
        if (value.length) {
          this.handleValueChange(value);
          this.valueChange.emit(this._value);
        } else {
          this.handleClear();
        }
      });
      this.subscriptions.add(subscription);
    }
  }

  private updateForm(): void {
    this.formGroup.controls.select.setValue(this.deserializeValue(this.getFormattedValue()), { emitEvent: false });
  }

  private formatValue(values: string[]): FilterParameter[] {
    if (this.config.isBooleanFormat) {
      return this.getClearedBooleanFormatValues(values);
    }

    return [{ key: this.config.mapKey.parameterKey, value: values.join(',') }];
  }

  private getFormattedValue(): string {
    if (this.config.isBooleanFormat) {
      const values = this._value.map((value) => value.key);
      return values.length ? values.join(',') : undefined;
    }

    return this.getValue('parameterKey');
  }

  private updateLabel(): void {
    const currentValues = this.formGroup.controls.select.value;

    if (currentValues.length) {
      const currentLabels = this.options.filter((option) => currentValues.includes(option.value)).map((option) => option.label);
      this.labelSubject.next(currentLabels.join(', '));
    } else {
      this.labelSubject.next(this.config.bubblePlaceholder);
    }
  }

  private updateIcon(): void {
    const icon = this.getSelectedIcon();

    if (this.config.mirrorsValueIcon && icon) {
      this.iconSubject.next(icon);
    } else {
      this.iconSubject.next(this.config.icon);
    }
  }

  private deserializeValue(commaSeparatedValue: string): string[] {
    return commaSeparatedValue?.split(',') || [];
  }

  private getSelectedIcon(): string {
    const currentValues = this.formGroup.controls.select.value;
    const icon = this.options.find((option) => currentValues.includes(option.value))?.icon;

    return typeof icon === 'string' ? icon : icon?.standard;
  }

  private getClearedBooleanFormatValues(values: string[]): FilterParameter[] {
    const oldParameters = this._value;
    const newParameters = values.map((value: FILTER_QUERY_PARAM_KEY) => ({ key: value, value: 'true' }));

    oldParameters.forEach(({ key }) => {
      if (!values.includes(key)) {
        newParameters.push({ key: key, value: undefined });
      }
    });

    return newParameters;
  }
}
