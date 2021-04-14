import { AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { GridSelectFilterParams } from './interfaces/grid-select-filter-params.interface';
import { GridSelectFilterConfig } from './interfaces/grid-select-filter-config.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { take } from 'rxjs/operators';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Component({
  selector: 'tsl-grid-select-filter',
  templateUrl: './grid-select-filter.component.html',
  styleUrls: ['./grid-select-filter.component.scss'],
})
export class GridSelectFilterComponent
  extends AbstractFilter<GridSelectFilterParams>
  implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input() config: GridSelectFilterConfig;

  public options: GridSelectFormOption[] = [];
  public formGroup = new FormGroup({
    select: new FormControl([]),
  });
  public labelSubject = new BehaviorSubject<string>('');

  private subscriptions = new Subscription();

  constructor(private optionService: FilterOptionService) {
    super();
  }

  public get label$(): Observable<string> {
    return this.labelSubject.asObservable();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initForm();
    this.optionService
      .getOptions(this.config.id)
      .pipe(take(1))
      .subscribe((options) => {
        this.options = options.map((option) => ({
          icon: option.icon,
          value: option.value as string,
          label: option.label,
        }));
      });
    this.initLabel();
  }

  public ngAfterContentInit(): void {
    if (this.value.length > 0) {
      this.updateForm();
      this.updateLabel();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange && this.hasValueChanged(changes.value.previousValue, changes.value.currentValue)) {
      if (this._value.length > 0) {
        this.updateForm();
        this.updateLabel();
      } else {
        this.handleClear();
        this.initLabel();
      }
    }
  }

  public handleApply() {
    super.handleApply();
    this.handleValueChange(this.formGroup.controls.select.value);
  }

  public writeValue(value: FilterParameter[]): void {
    super.writeValue(value);
    this.valueChange.emit(this.value);
  }

  public handleClear(): void {
    this.formGroup.controls.select.reset([]);
    super.handleClear();
  }

  private handleValueChange(value: string[]): void {
    if (!value || value.length === 0) {
      this.writeValue([]);
      this.initLabel();
    } else {
      this.writeValue([{ key: this.config.mapKey.parameterKey, value: value.join(',') }]);
    }

    this.updateLabel();
  }

  private initForm(): void {
    if (this.variant === FILTER_VARIANT.CONTENT) {
      const subscription = this.formGroup.controls.select.valueChanges.subscribe(this.handleValueChange.bind(this));
      this.subscriptions.add(subscription);
    }
  }

  private initLabel(): void {
    this.labelSubject.next(this.label);
  }

  private updateLabel(): void {
    const currentValues = this.formGroup.controls.select.value;
    const currentLabels = this.options.filter((option) => currentValues.includes(option.value)).map((option) => option.label);
    this.labelSubject.next(currentLabels.join(', '));
  }

  private updateForm(): void {
    this.formGroup.controls.select.setValue(this.deserializeValue(this.getValue('parameterKey')));
  }

  private deserializeValue(commaSeparatedValue: string): string[] {
    return commaSeparatedValue.split(',');
  }
}
