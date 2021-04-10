import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { RangeFilterConfig } from './interfaces/range-filter-config.interface';
import { RangeFilterParams } from './interfaces/range-filter-params.interface';

@Component({
  selector: 'tsl-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent extends AbstractFilter<RangeFilterParams> implements OnInit {
  @Input() config: RangeFilterConfig;
  limitlessPlaceholder = $localize`:@@Limitless:No limit`;
  formGroup = new FormGroup({
    range: new FormControl(),
    min: new FormControl(),
    max: new FormControl(),
  });

  public range: [number, number] = [0, 0];
  private readonly DEFAULT_DEBOUNCE_TIME = 200;

  ngOnInit(): void {
    this.initRange();
    super.ngOnInit();
    this.updateForm();
    this.bindFormValueChangesListeners();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    if (this.hasValueChanged(previousValue, currentValue)) {
      if (this._value.length > 0) {
        this.updateForm();
        this.emitChange();
      } else {
        this.handleClear();
      }
    }
  }

  public writeValue(value: FilterParameter[]) {
    if (value) {
      super.writeValue(value);
      this.updateForm();
    }
  }

  public handleApply(): void {
    this.emitChange();
  }

  public handleClear(): void {
    this.formGroup.controls.range.setValue([this.range[0], this.range[1]]);
    this.emitEmptyChange();
    this.setLabel(null, null);
    this.clear.emit();

    this.hasValueSubject.next(false);
  }

  private initRange(): void {
    if (this.config.stepsConfig) {
      this.range = [this.config.stepsConfig[0].range[0], this.config.stepsConfig[this.config.stepsConfig.length - 1].range[1]];
    } else {
      this.range = this.config.range;
    }
  }

  private updateForm(): void {
    const inputMin = this.getValue('minKey');
    const inputMax = this.getValue('maxKey');

    this.setLabel(parseInt(inputMin, 10), parseInt(inputMax, 10));

    this.formGroup.controls.range.setValue([inputMin || this.range[0], inputMax || this.range[1]], { emitEvent: false });
    this.formGroup.controls.min.setValue(inputMin || this.range[0], { emitEvent: false });
    this.formGroup.controls.max.setValue(inputMax ? inputMax : this.config.limitless ? null : inputMax || this.range[1], {
      emitEvent: false,
    });
  }

  private bindFormValueChangesListeners(): void {
    this.formGroup.controls.range.valueChanges.subscribe((range: [number, number]) => {
      this.formGroup.controls.min.setValue(range[0], { emitEvent: false });
      this.formGroup.controls.max.setValue(this.getMaxValue() ? this.getMaxValue() : this.config.limitless ? null : this.range[1], {
        emitEvent: false,
      });

      if (this.variant === FILTER_VARIANT.CONTENT) {
        this.emitChange();
      }
    });

    this.formGroup.controls.min.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((min: number) => {
      this.formGroup.controls.range.setValue([min, this.formGroup.controls.range.value[1]], { emitEvent: false });
    });

    this.formGroup.controls.max.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((max: number) => {
      this.formGroup.controls.range.setValue([this.formGroup.controls.range.value[0], max], { emitEvent: false });
    });
  }

  private emitEmptyChange(): void {
    this.valueChange.emit([]);
  }

  private emitChange(): void {
    this.setValue(this.getMinValue(), this.getMaxValue());
    this.valueChange.emit(this._value);
  }

  private setValue(min: number, max: number) {
    this._value = [];

    if (min) {
      this._value.push({ key: this.config.mapKey.minKey, value: min.toString() });
    }
    if (max) {
      this._value.push({ key: this.config.mapKey.maxKey, value: max.toString() });
    }

    this.setLabel(min, max);
    this.hasValueSubject.next(true);
  }

  private setLabel(min: number, max: number): void {
    if (min && max) {
      this.label = `${min}${this.config.units || ''} - ${max}${this.config.units || ''}`;
    } else if (min) {
      this.label = `${$localize`:@@From:From`} ${min}${this.config.units || ''}`;
    } else if (max) {
      this.label = `${$localize`:@@To:To`} ${max}${this.config.units || ''}`;
    } else {
      this.label = this.config.bubblePlaceholder;
    }
  }

  private getMaxValue(): number {
    const range = this.formGroup.controls.range.value;

    if (this.config.limitless) {
      return range[1] === this.range[1] ? null : range[1];
    } else if (range[1] === this.range[1]) {
      return null;
    } else {
      return range[1];
    }
  }

  private getMinValue(): number {
    const range = this.formGroup.controls.range.value;
    return this.range[0] === range[0] ? 0 : range[0];
  }
}
