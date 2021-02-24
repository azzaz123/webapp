import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { ToggleFilterConfig } from './interfaces/toggle-filter-config.interface';
import { ToggleFilterParams } from './interfaces/toggle-filter-params.interface';

@Component({
  selector: 'tsl-toggle-filter',
  templateUrl: './toggle-filter.component.html',
  styleUrls: ['./toggle-filter.component.scss'],
})
export class ToggleFilterComponent extends AbstractFilter<ToggleFilterParams> implements OnChanges {
  @Input() config: ToggleFilterConfig;

  public toggle: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value?.firstChange && this.hasValueChanged(changes.value.previousValue, changes.value.currentValue)) {
      if (this.value.length > 0) {
        this.toggle = this.getValue('key') === 'true' ? true : false;
      } else {
        this.handleClear();
      }
    }
  }

  public handleChange(): void {
    this.emitChange();
  }

  public handleClick(): void {
    this.toggle = !this.toggle;
    this.toggle ? this.handleChange() : this.handleClear();
  }

  public handleClear(): void {
    this.toggle = false;
    this.emitChange();
  }

  public hasValue(): boolean {
    return this.toggle;
  }

  private setValue(value: boolean): void {
    this.value = [{ key: this.config.mapKey.key, value: value.toString() }];
  }

  private emitChange(): void {
    this.setValue(this.toggle);
    this.valueChange.emit(this.value);
  }
}
