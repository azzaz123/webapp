import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
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
export class RangeFilterComponent extends AbstractFilter<RangeFilterParams> implements OnInit, OnChanges {
  @Input() config: RangeFilterConfig;
  limitlessPlaceholder = $localize`:@@Limitless:No limit`;
  formGroup: FormGroup;

  public range: [number, number] = [0, 0];
  private readonly DEFAULT_DEBOUNCE_TIME = 200;

  ngOnInit(): void {
    this.initRange();
    super.ngOnInit();
    this.createForm();
    this.bindFormValueChangesListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value?.firstChange && JSON.stringify(changes.value.previousValue) !== JSON.stringify(changes.value.currentValue)) {
      if (this.value.length > 0) {
        this.updateForm();
        this.emitChange();
      } else {
        this.handleClear();
      }
    }
  }

  public handleApply(): void {
    this.emitChange();
  }

  public hasValue(): boolean {
    return this.value?.length > 0;
  }

  public handleClear(): void {
    this.formGroup.controls.range.setValue([this.range[0], this.range[1]]);
    this.emitEmptyChange();
    this.setLabel(null, null);
    this.value = [];
    this.clear.emit();
  }

  private initRange(): void {
    if (this.config.stepsConfig) {
      this.range = [this.config.stepsConfig[0].range[0], this.config.stepsConfig[this.config.stepsConfig.length - 1].range[1]];
    } else {
      this.range = this.config.range;
    }
  }

  private createForm(): void {
    this.formGroup = new FormGroup({
      range: new FormControl(),
      min: new FormControl(),
      max: new FormControl(),
    });

    this.updateForm();
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
      this.formGroup.controls.max.setValue(this.getMaxValue(), { emitEvent: false });

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
    this.change.emit([]);
  }

  private emitChange(): void {
    this.setValue(this.getMinValue(), this.getMaxValue());
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
    } else {
      return range[1];
    }
  }

  private getMinValue(): number {
    const range = this.formGroup.controls.range.value;
    return range[0];
  }
}
