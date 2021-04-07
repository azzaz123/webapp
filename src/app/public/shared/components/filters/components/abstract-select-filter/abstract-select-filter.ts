import { Directive, Input } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { AbstractSelectFilterConfig } from './interfaces/abstract-select-filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class AbstractSelectFilter<T extends Partial<Record<keyof T, string>>> extends AbstractFilter<T> {
  @Input() config: AbstractSelectFilterConfig<T>;

  constructor() {
    super();
  }

  public get contentTitle(): string {
    return this.config.title;
  }

  public get drawerPlaceholder(): string {
    return this.config.drawerPlaceholder;
  }

  public hasContentPlaceholder(): boolean {
    return this.variant === FILTER_VARIANT.CONTENT && this.config.hasContentPlaceholder;
  }
}
