import { Directive, Input } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { AbstractSelectorFilterConfig } from './interfaces/selector-filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { QueryParams } from '../../core/interfaces/query-params.interface';
import { PaginationOptions } from '../../core/interfaces/pagination-options.interface';
import { Observable } from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class AbstractSelectorFilter<T extends Record<keyof T, string>> extends AbstractFilter<T> {
  @Input() config: AbstractSelectorFilterConfig<T>;

  constructor(private optionService: FilterOptionService) {
    super();
  }

  protected getOptions(params?: QueryParams, paginationOptions?: PaginationOptions): Observable<FilterOption[]> {
    return this.optionService.getOptions(this.config.id, params, paginationOptions);
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
