import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Params } from '@angular/router';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { Observable, of } from 'rxjs';

@Injectable()
export class SearchResolver implements Resolve<boolean> {
  constructor(
    private searchNavigatorService: SearchNavigatorService,
    private queryStringService: SearchQueryStringService,
    private locationService: QueryStringLocationService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const queryParams = route.queryParams;

    if (!this.routeContainLocationParams(queryParams)) {
      const filterParams = this.queryStringService.mapQueryToFilterParams(queryParams);
      const locationParams = this.locationService.getLocationParameters();

      filterParams.push(
        { key: FILTER_QUERY_PARAM_KEY.latitude, value: locationParams.latitude },
        { key: FILTER_QUERY_PARAM_KEY.longitude, value: locationParams.longitude }
      );

      this.searchNavigatorService.navigate(filterParams, null, false, true);
    }
    return of(true);
  }

  private routeContainLocationParams(params: Params): boolean {
    return FILTER_QUERY_PARAM_KEY.latitude in params && FILTER_QUERY_PARAM_KEY.longitude in params;
  }
}
