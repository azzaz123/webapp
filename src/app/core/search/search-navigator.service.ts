import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';

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
  public navigate(filterParams: FilterParameter[], keepCurrentParams?: boolean): void {
    const currentParams = this.route.snapshot.queryParams;
    let newParams = this.queryStringService.mapFilterToQueryParams(filterParams);

    if (keepCurrentParams) {
      newParams = { ...currentParams, ...newParams };
    }

    const queryParams = this.cleanParams(currentParams, newParams);

    this.router.navigate(['/search'], {
      queryParams,
    });
  }

  private cleanParams(currentParams: Params, newParams: Params): Params {
    let cleanedParams: Params = newParams;

    if (this.hasCategoryChanged(currentParams, newParams)) {
      cleanedParams = this.cleanCategory(newParams);
    }

    if (this.hasRealEstateChanged(currentParams, newParams)) {
      cleanedParams = this.cleanRealEstate(currentParams, newParams);
    }

    return this.injectLocation(this.cleanUndefined(cleanedParams));
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

  private cleanCategory(newParams: Params): Params {
    return {
      [FILTER_QUERY_PARAM_KEY.categoryId]: newParams[FILTER_QUERY_PARAM_KEY.categoryId],
      [FILTER_QUERY_PARAM_KEY.keywords]: newParams[FILTER_QUERY_PARAM_KEY.keywords],
    };
  }

  // TODO: Review and refactor this
  private cleanRealEstate(currentParams: Params, newParams: Params): Params {
    const realEstateParams: Params = { ...newParams };

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
      if (currentParams[FILTER_QUERY_PARAM_KEY.type] === 'room') {
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

  private injectLocation(params: Params): Params {
    const locationParams = this.locationService.getLocationParameters({
      [FILTER_QUERY_PARAM_KEY.longitude]: params[FILTER_QUERY_PARAM_KEY.longitude],
      [FILTER_QUERY_PARAM_KEY.latitude]: params[FILTER_QUERY_PARAM_KEY.latitude],
    });

    return { ...params, ...locationParams };
  }
}
