import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SliderFormStepsConfig } from '@shared/form/components/slider/interfaces/slider-form-steps-config.interface';
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
  stepsConfig?: SliderFormStepsConfig;
  units?: string;
  limitless?: boolean;
  limitlessPlaceholder = $localize`:@@Limitless:No limit`;

  formGroup: FormGroup;
  private readonly DEFAULT_DEBOUNCE_TIME = 200;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      range: new FormControl([this.range[0], this.range[1]]),
      min: new FormControl(0),
      max: new FormControl(this.limitless ? null : this.range[1]),
    });

    this.formGroup.controls.range.valueChanges.subscribe((range: [number, number]) => {
      this.formGroup.controls.min.setValue(range[0], { emitEvent: false });
      this.formGroup.controls.max.setValue(this.limitless && range[1] === this.range[1] ? null : range[1], { emitEvent: false });
    });

    this.formGroup.controls.min.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((min: number) => {
      this.formGroup.controls.range.setValue([min, this.formGroup.controls.range.value[1]], { emitEvent: false });
    });

    this.formGroup.controls.max.valueChanges.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe((max: number) => {
      this.formGroup.controls.range.setValue([this.formGroup.controls.range.value[0], max], { emitEvent: false });
    });
  }

  public getLabel(): string {
    throw new Error('Method not implemented.');
  }

  private emitChange(): void {
    this.setValue(
      this.formGroup.controls.min.value,
      this.limitless
        ? this.formGroup.controls.max.value === this.range[1]
          ? null
          : this.formGroup.controls.max.value
        : this.formGroup.controls.max.value
    );
    this.change.emit(this.value);
  }

  private setValue(min: number, max: number) {
    this.value = [{ key: this.config.mapKey.minKey, value: min.toString() }];
    if (max) {
      this.value.push({ key: this.config.mapKey.maxKey, value: max.toString() });
    }
  }
}
