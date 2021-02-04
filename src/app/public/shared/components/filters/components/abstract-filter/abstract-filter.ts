import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';
import { EventEmitter, Input, Output } from '@angular/core';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

export abstract class AbstractFilter implements Filter {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.DROPDOWN;
  @Input() config: FilterConfig;
  @Input() value: FilterParameter[] = [];
  @Output() change = new EventEmitter<FilterParameter[]>();
  @Output() clear = new EventEmitter<void>();
  @Output() openStateChange = new EventEmitter<boolean>();

  public isDropdown(): boolean {
    return this.variant === FILTER_VARIANT.DROPDOWN;
  }

  public hasValue(): boolean {
    return this.value.length > 0;
  }

  public filterCounter(): number {
    return this.value.length > 1 ? this.value.length : undefined;
  }

  public abstract get label(): string | undefined;

  public abstract get icon(): string | undefined;

  public abstract handleBubbleClick(): void;
}
