import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, MaxLengthValidator } from '@angular/forms';
import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-steps-config.interface';
import { debounceTime, delay } from 'rxjs/operators';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { RangeFilterConfig } from './interfaces/range-filter-config.interface';
import { RangeFilterParams } from './interfaces/range-filter-params.interface';

@Component({
  selector: 'tsl-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent extends AbstractFilter<RangeFilterParams> implements RangeFilterConfig, OnInit {
  range: [number, number] = [0, 0];
  stepsConfig?: SliderFormStepConfig[];
  units?: string = '';
  limitless?: boolean;
  limitlessPlaceholder = $localize`:@@Limitless:No limit`;
  placeholder: string;

  formGroup: FormGroup;
  private readonly DEFAULT_DEBOUNCE_TIME = 200;
  private label: string;
  ready: boolean = false;

  ngOnInit(): void {
    this.label = this.placeholder;

    console.log('range antes', this.range);
    console.log('limitless', this.limitless);

    // SETTING RANGE

    if (this.stepsConfig) {
      this.range = [this.stepsConfig[0].range[0], this.stepsConfig[this.stepsConfig.length - 1].range[1]];
    }

    this.formGroup = new FormGroup({
      range: new FormControl([this.range[0], this.range[1]]),
      min: new FormControl(this.range[0]),
      max: new FormControl(this.limitless ? null : this.range[1]),
    });

    this.formGroup.controls.range.valueChanges.subscribe((range: [number, number]) => {
      this.formGroup.controls.min.setValue(range[0], { emitEvent: false });
      this.formGroup.controls.max.setValue(range[1], { emitEvent: false });
      console.log('valueChanges', 'range', range, this.formGroup.controls.range.value);
    });

    this.formGroup.controls.min.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((min: number) => {
      this.formGroup.controls.range.setValue([min, this.formGroup.controls.range.value[1]], { emitEvent: false });
      console.log('valueChanges', 'min', min);
    });

    this.formGroup.controls.max.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((max: number) => {
      this.formGroup.controls.range.setValue([this.formGroup.controls.range.value[0], max], { emitEvent: false });
      console.log('valueChanges', 'max', max);
    });
  }

  public getLabel(): string {
    return this.label;
  }

  public handleApply(): void {
    this.emitChange();
  }

  public handleClear(): void {}

  private emitChange(): void {
    this.setValue(this.getMinValue(), this.getMaxValue());
    console.log('emitChange', this.getMinValue(), this.getMaxValue());
    this.change.emit(this.value);
  }

  private setValue(min: number, max: number) {
    this.value = [];

    if (min) {
      this.value.push({ key: this.config.mapKey.minKey, value: min.toString() });
    }
    if (max) {
      this.value.push({ key: this.config.mapKey.maxKey, value: max.toString() });
    }

    this.setLabel(min, max);
  }

  private setLabel(min: number, max: number): void {
    if (min && max) {
      this.label = `${min}${this.units} - ${max}${this.units}`;
    } else if (min) {
      this.label = `${$localize`:@@From:From`} ${min}${this.units}`;
    } else if (max) {
      this.label = `${$localize`:@@To:To`} ${max}${this.units}`;
    } else {
      this.label = this.placeholder;
    }
  }

  private getMaxValue(): number {
    const range = this.formGroup.controls.range.value;

    if (this.limitless) {
      return range[1] === this.range[1] ? null : this.range[1];
    } else {
      return range[1];
    }
  }

  private getMinValue(): number {
    const range = this.formGroup.controls.range.value;
    return range[0] === this.range[0] ? null : range[0];
  }
}
