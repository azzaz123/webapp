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
  limitlessPlaceholder = $localize`:@@web_limitless:No limit`;
  formGroup = new FormGroup({
    range: new FormControl(),
    min: new FormControl(),
    max: new FormControl(),
  });

  public range: [number, number] = [0, 0];
  private readonly DEFAULT_DEBOUNCE_TIME = 200;

  public handleApply(): void {
    this.applyChanges();
  }

  public handleClear(): void {
    super.handleClear();
    this.cleanForm();
  }

  public ngOnInit(): void {
    this.initRange();
    this.updateForm();
    this.bindFormValueChangesListeners();
    super.ngOnInit();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    if (this._value.length > 0) {
      this.updateForm();
    } else {
      this.cleanForm();
    }
  }

  private initRange(): void {
    if (this.config.stepsConfig) {
      this.range = [this.config.stepsConfig[0].range[0], this.config.stepsConfig[this.config.stepsConfig.length - 1].range[1]];
    } else {
      this.range = this.config.range;
    }
  }

  private bindFormValueChangesListeners(): void {
    this.formGroup.controls.range.valueChanges.subscribe((range: [number, number]) => {
      this.formGroup.controls.min.setValue(range[0], { emitEvent: false });
      this.formGroup.controls.max.setValue(this.getMaxValue() ? this.getMaxValue() : this.config.limitless ? null : this.range[1], {
        emitEvent: false,
      });

      if (this.variant === FILTER_VARIANT.CONTENT) {
        this.applyChanges();
      }
    });

    this.formGroup.controls.min.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((min: number) => {
      this.formGroup.controls.range.setValue([min, this.formGroup.controls.range.value[1]], { emitEvent: false });
    });

    this.formGroup.controls.max.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((max: number) => {
      this.formGroup.controls.range.setValue([this.formGroup.controls.range.value[0], max], { emitEvent: false });
    });
  }

  private applyChanges(): void {
    const min = this.getMinValue();
    const max = this.getMaxValue();
    this.setValue(min, max);
    this.setLabel(min, max);
    this.valueChange.emit(this._value);
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

  private cleanForm(): void {
    this.formGroup.controls.range.setValue([this.range[0], this.range[1]]);
    this.setLabel(null, null);
  }

  private setValue(min: number, max: number) {
    this.writeValue([
      { key: this.config.mapKey.minKey, value: min?.toString() },
      { key: this.config.mapKey.maxKey, value: max?.toString() },
    ]);
  }

  private setLabel(min: number, max: number): void {
    if (min && max) {
      this.label = `${min}${this.config.units || ''} - ${max}${this.config.units || ''}`;
    } else if (min) {
      this.label = `${$localize`:@@web_from:From`} ${min}${this.config.units || ''}`;
    } else if (max) {
      this.label = `${$localize`:@@web_to:To`} ${max}${this.config.units || ''}`;
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
    return this.range[0] === range[0] ? null : range[0];
  }
}
