import { Inject, Injectable } from '@angular/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { BehaviorSubject } from 'rxjs';
import { SORT_BY_RELEVANCE_CATEGORY_IDS } from './constants/sort-by-config-constants';
import { SORT_BY, SORT_BY_DEFAULT_OPTIONS, SORT_BY_RELEVANCE_OPTIONS } from './constants/sort-by-options-constants';

@Injectable()
export class SortByService {
  private optionsSubject = new BehaviorSubject<SelectFormOption<SORT_BY>[]>(SORT_BY_DEFAULT_OPTIONS);
  public options$ = this.optionsSubject.asObservable();
  private relevanceOptionActiveSubject = new BehaviorSubject<boolean>(false);
  public relevanceOptionActive$ = this.relevanceOptionActiveSubject.asObservable();

  constructor(@Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStore: FilterParameterStoreService) {
    this.filterParameterStore.parameters$.subscribe(() => {
      this.optionsSubject.next(this.getOptionsByParameters());
      this.relevanceOptionActiveSubject.next(this.relevanceOptionActive());
    });
  }

  private getOptionsByParameters(): SelectFormOption<SORT_BY>[] {
    return this.relevanceOptionActive() ? SORT_BY_RELEVANCE_OPTIONS : SORT_BY_DEFAULT_OPTIONS;
  }

  private relevanceOptionActive(): boolean {
    const categoryIds = this.filterParameterStore.getParametersByKeys([FILTER_QUERY_PARAM_KEY.categoryId])[0]?.value;
    const keyword = this.filterParameterStore.getParametersByKeys([FILTER_QUERY_PARAM_KEY.keywords])[0]?.value;

    return SORT_BY_RELEVANCE_CATEGORY_IDS.includes(parseInt(categoryIds, 10)) && !!keyword;
  }
}
