import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { ToggleFilterConfig } from './interfaces/toggle-filter-config.interface';
import { ToggleFilterParams } from './interfaces/toggle-filter-params.interface';

@Component({
  selector: 'tsl-toggle-filter',
  templateUrl: './toggle-filter.component.html',
  styleUrls: ['./toggle-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleFilterComponent extends AbstractFilter<ToggleFilterParams> implements OnChanges {
  @Input() config: ToggleFilterConfig;

  toggle: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes1!', changes.value);
    if (!changes.value?.firstChange && this.hasValueChanged(changes.value.previousValue, changes.value.currentValue)) {
      if (this.value.length > 0) {
        console.log('changes!');
      } else {
        this.handleClear();
      }
    }
  }

  valueChange(): void {
    this.setValue(this.toggle);
    this.change.emit();
  }
  handleClick(): void {
    console.log('toggleValue');
    this.toggle = !this.toggle;
    this.valueChange();
  }

  handleClear(): void {
    this.toggle = false;
    this.value = [];
    this.clear.emit();
  }

  private setValue(value: boolean): void {
    this.value = [{ key: this.config.mapKey.key, value: value.toString() }];
  }
}
