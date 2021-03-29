import { Directive, Input } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { SelectorFilterConfig } from '@public/shared/components/filters/components/abstract-selector-filter/interfaces/selector-filter-config.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class AbstractSelectorFilter<T extends Record<string, string>> extends AbstractFilter<T> {
  @Input() config: SelectorFilterConfig<T>;

  public get contentTitle(): string {
    return this.config.title;
  }

  public get drawerPlaceholder(): string {
    return this.config.drawerPlaceholder;
  }

  public hasContentPlaceholder(): boolean {
    return this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder && !this.isPlaceholderOpen;
  }
}
