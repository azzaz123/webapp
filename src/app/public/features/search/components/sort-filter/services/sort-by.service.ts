import { Inject, Injectable } from '@angular/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
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

  constructor(@Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStore: FilterParameterStoreService) {
    this.filterParameterStore.parameters$.subscribe((parameters) => {
      this.optionsSubject.next(this.getOptionsByParameters(parameters));
    });
  }

  private getOptionsByParameters(parameters: FilterParameter[]): SelectFormOption<SORT_BY>[] {
    const categoryIds = parameters.find((parameter) => parameter.key === FILTER_QUERY_PARAM_KEY.categoryId)?.value;
    const keyword = parameters.find((parameter) => parameter.key === FILTER_QUERY_PARAM_KEY.keywords)?.value;
    const relevanceActive = SORT_BY_RELEVANCE_CATEGORY_IDS.includes(parseInt(categoryIds)) && keyword;
    return relevanceActive ? SORT_BY_RELEVANCE_OPTIONS : SORT_BY_DEFAULT_OPTIONS;
  }
}
