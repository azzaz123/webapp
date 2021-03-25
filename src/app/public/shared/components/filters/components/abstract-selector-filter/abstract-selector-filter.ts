import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { SelectorFilterConfig } from '@public/shared/components/filters/components/abstract-selector-filter/interfaces/selector-filter-config.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class AbstractSelectorFilter<T extends Record<string, string>> extends AbstractFilter<T> {
  @Input() config: SelectorFilterConfig<T>;
  @Output() onPlaceholderClick = new EventEmitter<void>();

  public isContentWrapper(): boolean {
    return this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder;
  }

  public handleOnPlaceholderClick(): void {
    this.onPlaceholderClick.emit();
  }
}
