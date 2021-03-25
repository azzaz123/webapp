import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { SelectorFilterConfig } from '@public/shared/components/filters/components/abstract-selector-filter/interfaces/selector-filter-config.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class AbstractSelectorFilter<T extends Record<string, string>> extends AbstractFilter<T> {
  @Input() config: SelectorFilterConfig<T>;
  @Output() placeholderOpenChange = new EventEmitter<boolean>();

  public isPlaceholderOpen = false;

  public hasContentPlaceholder(): boolean {
    return this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder && !this.isPlaceholderOpen;
  }

  public togglePlaceholderOpen(): void {
    this.isPlaceholderOpen = !this.isPlaceholderOpen;
    this.placeholderOpenChange.emit(this.isPlaceholderOpen);
  }
}
