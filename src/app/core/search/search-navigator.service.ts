import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
// import { LocationFilterServiceService } from '@public/features/search/core/services/location-filter-service.service';
// import { QueryStringLocationService } from '@public/features/search/core/services/query-string-location.service'; // TODO: Move to core

@Injectable({
  providedIn: 'root',
})
export class SearchNavigatorService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private queryStringService: SearchQueryStringService // private locationService: QueryStringLocationService
  ) {}
  public navigate(filterParams: FilterParameter[]): void {
    const currentParams = this.route.snapshot.queryParams;
    const newParams = this.queryStringService.mapFilterToQueryParams(filterParams);
    const queryParams = this.cleanParams(currentParams, newParams);

    this.router.navigate(['/search'], {
      queryParams,
    });
  }

  private cleanParams(currentParams: Params, newParams: Params): Params {
    let cleanedParams: Params = newParams;

    if (this.hasCategoryChanged(currentParams, newParams)) {
      cleanedParams = this.cleanCategory(currentParams, newParams);
    }
    //
    // if (this.hasRealEstateChanged(currentParams, newParams)) {
    //   return this.cleanRealEstate();
    // }

    return this.cleanUndefined(cleanedParams);
  }

  private hasCategoryChanged(currentParams: Params, newParams: Params): boolean {
    const currentCategory = currentParams[FILTER_QUERY_PARAM_KEY.categoryId];
    const newCategory = newParams[FILTER_QUERY_PARAM_KEY.categoryId];

    return currentCategory !== newCategory;
  }

  private cleanCategory(currentParams: Params, newParams: Params): Params {
    return {
      [FILTER_QUERY_PARAM_KEY.categoryId]: newParams[FILTER_QUERY_PARAM_KEY.categoryId] || currentParams[FILTER_QUERY_PARAM_KEY.categoryId],
      [FILTER_QUERY_PARAM_KEY.keywords]: newParams[FILTER_QUERY_PARAM_KEY.keywords],
      // ...locationAPI.getUserLatLng(),
    };
  }

  private cleanUndefined(params: Params): Params {
    const cleanedParams = {};
    const keys = Object.keys(params).filter((key) => params[key]);

    keys.forEach((key) => (cleanedParams[key] = params[key]));

    return cleanedParams;
  }
}
