import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.component';
import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';

@Component({
  selector: 'tsl-abstract-filter',
  templateUrl: './abstract-filter.component.html',
  styleUrls: ['./abstract-filter.component.scss'],
})
export class AbstractFilterComponent implements Filter {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.DROPDOWN;
  @Input() config: FilterConfig;
  @Input() value: FilterParameter[] = [];
  @Output() change: EventEmitter<FilterParameter[]>;
  @Output() clear: EventEmitter<void>;
  @Output() openStateChange: EventEmitter<boolean>;

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  public get isDropdown(): boolean {
    return this.variant === FILTER_VARIANT.DROPDOWN;
  }

  public get hasValue(): boolean {
    return this.value.length > 0;
  }

  public get filterCounter(): number {
    return this.value.length > 1 ? this.value.length : undefined;
  }

  public get label(): string | undefined {
    return 'Hello world';
  }

  public get icon(): string | undefined;

  public handleBubbleClick(template: TemplateRef<unknown>): void;
}
