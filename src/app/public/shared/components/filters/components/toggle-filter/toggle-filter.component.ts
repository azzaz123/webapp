import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { ToggleFilterConfig } from './interfaces/toggle-filter-config.interface';
import { ToggleFilterParams } from './interfaces/toggle-filter-params.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';

@Component({
  selector: 'tsl-toggle-filter',
  templateUrl: './toggle-filter.component.html',
  styleUrls: ['./toggle-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleFilterComponent extends AbstractFilter<ToggleFilterParams> implements OnInit, OnChanges {
  @Input() config: ToggleFilterConfig;

  public toggle: boolean;

  public ngOnInit(): void {
    super.ngOnInit();
    this.toggle = this.getBooleanValue();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value?.firstChange && this.hasValueChanged(changes.value.previousValue, changes.value.currentValue)) {
      if (this._value.length > 0) {
        this.toggle = this.getBooleanValue();
      } else {
        this.handleClear();
      }
    }
  }

  public writeValue(value: FilterParameter[]) {
    super.writeValue(value);
    this.toggle = this.getBooleanValue();
    this.hasValueSubject.next(this.toggle);
  }

  public handleChange(): void {
    this.toggle ? this.emitChange() : this.handleClear();
  }

  public handleClick(): void {
    if (this.variant === FILTER_VARIANT.BUBBLE) {
      this.toggle = !this.toggle;
      this.handleChange();
    }
  }

  public handleClear(): void {
    this.hasValueSubject.next(false);
    this.toggle = false;
    this.clear.emit();
  }

  protected _hasValue(): boolean {
    return this.toggle;
  }

  private setValue(value: boolean): void {
    this._value = [{ key: this.config.mapKey.key, value: value.toString() }];
  }

  private emitChange(): void {
    this.hasValueSubject.next(true);
    this.setValue(this.toggle);
    this.valueChange.emit(this._value);
  }

  private getBooleanValue(): boolean {
    return super.getValue('key') === 'true';
  }
}
