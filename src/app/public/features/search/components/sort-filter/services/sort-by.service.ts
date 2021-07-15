import { Inject, Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SORT_BY_RELEVANCE_CATEGORY_IDS } from './constants/sort-by-config-constants';
import { SORT_BY, SORT_BY_DEFAULT_OPTIONS, SORT_BY_RELEVANCE_OPTIONS } from './constants/sort-by-options-constants';

@Injectable()
export class SortByService {
  private optionsSubject = new BehaviorSubject<SelectFormOption<SORT_BY>[]>(SORT_BY_DEFAULT_OPTIONS);
  private isRelevanceOptionActiveSubject = new BehaviorSubject<boolean>(false);
  private isRelevanceFeatureFlagActive = true;
  public options$ = this.optionsSubject.asObservable();
  public isRelevanceOptionActive$ = this.isRelevanceOptionActiveSubject.asObservable();

  constructor(
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStore: FilterParameterStoreService,
    private featureFlagService: FeatureFlagService
  ) {
    this.featureFlagService
      .getFlag(FEATURE_FLAGS_ENUM.SORT_BY_RELEVANCE)
      .pipe(take(1))
      .subscribe(
        (isEnabled) => {
          this.isRelevanceFeatureFlagActive = isEnabled;
        },
        () => {
          this.isRelevanceFeatureFlagActive = false;
        }
      );

    this.filterParameterStore.parameters$.subscribe(() => {
      this.optionsSubject.next(this.getOptionsByParameters());
      this.isRelevanceOptionActiveSubject.next(this.isRelevanceOptionActive());
    });
  }

  private getOptionsByParameters(): SelectFormOption<SORT_BY>[] {
    return this.isRelevanceOptionActive() && this.isRelevanceFeatureFlagActive ? SORT_BY_RELEVANCE_OPTIONS : SORT_BY_DEFAULT_OPTIONS;
  }

  private isRelevanceOptionActive(): boolean {
    const categoryIds = this.filterParameterStore.getParametersByKeys([FILTER_QUERY_PARAM_KEY.categoryId])[0]?.value;
    const keyword = this.filterParameterStore.getParametersByKeys([FILTER_QUERY_PARAM_KEY.keywords])[0]?.value;
    const categoryWithSortByRelevanceEnabled = SORT_BY_RELEVANCE_CATEGORY_IDS.includes(parseInt(categoryIds, 10)) || !categoryIds;
    return categoryWithSortByRelevanceEnabled && !!keyword && this.isRelevanceFeatureFlagActive;
  }
}
