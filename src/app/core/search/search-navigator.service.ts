import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { QueryStringLocationService } from './query-string-location.service';

@Injectable({
  providedIn: 'root',
})
export class SearchNavigatorService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private queryStringService: SearchQueryStringService,
    private locationService: QueryStringLocationService
  ) {}
  private notAutomaticallyCleanableParams: FILTER_QUERY_PARAM_KEY[] = [
    FILTER_QUERY_PARAM_KEY.keywords,
    FILTER_QUERY_PARAM_KEY.latitude,
    FILTER_QUERY_PARAM_KEY.longitude,
    FILTER_QUERY_PARAM_KEY.distance,
    FILTER_QUERY_PARAM_KEY.orderBy,
  ];

  public addLocationParams(currentParams: Params) {
    const locationParams = this.locationService.getLocationParameters();
    const queryParams = { ...currentParams, ...locationParams };

    this.router.navigate(['/search'], {
      relativeTo: this.route,
      queryParams,
    });
  }

  public navigate(filterParams: FilterParameter[], filtersSource: FILTERS_SOURCE): void {
    const newQueryParams = this.getQueryParamsAfterFiltersChanged(filtersSource, filterParams);

    this.router.navigate(['/search'], {
      queryParams: {
        ...newQueryParams,
        [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: filtersSource,
      },
    });
  }

  private getQueryParamsAfterFiltersChanged(filtersSource: FILTERS_SOURCE, filterParams: FilterParameter[]): Params {
    const queryParams = this.queryStringService.mapFilterToQueryParams(filterParams);

    if (filtersSource === FILTERS_SOURCE.DEFAULT_FILTERS) {
      return this.cleanUndefined(queryParams);
    }

    const currentParams = this.route.snapshot.queryParams;
    const newParams = { ...currentParams, ...queryParams };

    if (this.hasCategoryChanged(currentParams, newParams)) {
      return this.getParamsAfterCategoryChanged(newParams);
    }

    if (this.hasRealEstateChanged(currentParams, newParams)) {
      return this.getParamsAfterRealEstateChanged(currentParams, newParams);
    }

    return this.cleanUndefined(newParams);
  }

  private getParamsAfterCategoryChanged(newParams: Params): Params {
    const params = { [FILTER_QUERY_PARAM_KEY.categoryId]: newParams[FILTER_QUERY_PARAM_KEY.categoryId] };

    this.notAutomaticallyCleanableParams.forEach((key) => (params[key] = newParams[key]));

    return this.cleanUndefined(params);
  }

  private getParamsAfterRealEstateChanged(currentParams: Params, newParams: Params): Params {
    const params = this.cleanRealEstate(currentParams, newParams);

    return this.cleanUndefined(params);
  }

  private hasCategoryChanged(currentParams: Params, newParams: Params): boolean {
    const currentCategory = currentParams[FILTER_QUERY_PARAM_KEY.categoryId];
    const newCategory = newParams[FILTER_QUERY_PARAM_KEY.categoryId];

    return currentCategory !== newCategory;
  }

  private hasRealEstateChanged(currentParams: Params, newParams: Params) {
    if (newParams[FILTER_QUERY_PARAM_KEY.categoryId] !== CATEGORY_IDS.REAL_ESTATE.toString()) {
      return false;
    }

    const currentOperation = currentParams[FILTER_QUERY_PARAM_KEY.operation];
    const currentType = currentParams[FILTER_QUERY_PARAM_KEY.type];
    const newOperation = newParams[FILTER_QUERY_PARAM_KEY.operation];
    const newType = newParams[FILTER_QUERY_PARAM_KEY.type];

    return currentOperation !== newOperation || currentType !== newType;
  }

  // TODO: Review and refactor this
  private cleanRealEstate(currentParams: Params, newParams: Params): Params {
    const realEstateParams: Params = { ...currentParams, ...newParams };

    if (
      (newParams[FILTER_QUERY_PARAM_KEY.operation] || currentParams[FILTER_QUERY_PARAM_KEY.operation]) &&
      (newParams[FILTER_QUERY_PARAM_KEY.type] || currentParams[FILTER_QUERY_PARAM_KEY.type]) &&
      (currentParams[FILTER_QUERY_PARAM_KEY.type] !== newParams[FILTER_QUERY_PARAM_KEY.type] ||
        currentParams[FILTER_QUERY_PARAM_KEY.operation] !== newParams[FILTER_QUERY_PARAM_KEY.operation])
    ) {
      realEstateParams[FILTER_QUERY_PARAM_KEY.minPrice] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.maxPrice] = undefined;
    }

    if (currentParams[FILTER_QUERY_PARAM_KEY.operation] !== newParams[FILTER_QUERY_PARAM_KEY.operation]) {
      if (currentParams[FILTER_QUERY_PARAM_KEY.type] === REAL_ESTATE_SPECIFICATION_TYPE.ROOM) {
        newParams[FILTER_QUERY_PARAM_KEY.type] = undefined;
      }
      realEstateParams[FILTER_QUERY_PARAM_KEY.rooms] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.bathrooms] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.elevator] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.garage] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.terrace] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.pool] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.garden] = undefined;
    }

    if (currentParams[FILTER_QUERY_PARAM_KEY.type] !== newParams[FILTER_QUERY_PARAM_KEY.type]) {
      realEstateParams[FILTER_QUERY_PARAM_KEY.minSurface] = undefined;
      realEstateParams[FILTER_QUERY_PARAM_KEY.maxSurface] = undefined;
      if (
        realEstateParams[FILTER_QUERY_PARAM_KEY.type] &&
        realEstateParams[FILTER_QUERY_PARAM_KEY.type] !== REAL_ESTATE_SPECIFICATION_TYPE.HOUSE &&
        realEstateParams[FILTER_QUERY_PARAM_KEY.type] !== REAL_ESTATE_SPECIFICATION_TYPE.FLAT
      ) {
        realEstateParams[FILTER_QUERY_PARAM_KEY.rooms] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.bathrooms] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.elevator] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.garage] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.terrace] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.pool] = undefined;
        realEstateParams[FILTER_QUERY_PARAM_KEY.garden] = undefined;
      }
    }

    return realEstateParams;
  }

  private cleanUndefined(params: Params): Params {
    const cleanedParams = {};
    const keys = Object.keys(params).filter((key) => params[key]);

    keys.forEach((key) => (cleanedParams[key] = params[key]));

    return cleanedParams;
  }
}
