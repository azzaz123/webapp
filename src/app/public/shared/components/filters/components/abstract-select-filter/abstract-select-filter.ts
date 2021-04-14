import { Directive, Input } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { AbstractSelectFilterConfig } from './interfaces/abstract-select-filter-config.interface';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractSelectFilter<T extends Partial<Record<keyof T, string>>> extends AbstractFilter<T> {
  @Input() config: AbstractSelectFilterConfig<T>;

  // TODO: TechDebt: check setter / getters on templates, they are treated as functions so we are processing unnecessary
  public get contentTitle(): string {
    return this.config.title;
  }

  public get drawerPlaceholder(): string {
    return this.config.drawerPlaceholder;
  }
}
