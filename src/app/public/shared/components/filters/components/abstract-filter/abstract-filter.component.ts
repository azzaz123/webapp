import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Component({
  selector: 'tsl-abstract-filter',
  templateUrl: './abstract-filter.component.html',
  styleUrls: ['./abstract-filter.component.scss'],
})
export class AbstractFilterComponent {
  @Input() variant: FILTER_VARIANT;
  @Input() config: FilterConfig;
  @Input() value: FilterParameter[];
  @Output() change: EventEmitter<FilterParameter[]>;
  @Output() clear: EventEmitter<void>;
  @Output() openStateChange: EventEmitter<boolean>;

  public get isDropdown(): boolean {
    return this.variant === FILTER_VARIANT.DROPDOWN;
  }

  public get label(): string {
    return 'I am a label';
  }

  public handleBubbleClick(template: TemplateRef<unknown>): void {
    console.log('Bubble Click!!');
  }
}
