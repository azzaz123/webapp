import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Params } from '@angular/router';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { Observable, of } from 'rxjs';

@Injectable()
export class SearchResolver implements Resolve<boolean> {
  constructor(private searchNavigatorService: SearchNavigatorService, private queryStringService: SearchQueryStringService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const queryParams = route.queryParams;

    if (!this.routeContainLocationParams(queryParams)) {
      const filterParams = this.queryStringService.mapQueryToFilterParams(queryParams);

      this.searchNavigatorService.navigate(filterParams, null, false, true);
    }
    return of(true);
  }

  private routeContainLocationParams(params: Params): boolean {
    return FILTER_QUERY_PARAM_KEY.latitude in params && FILTER_QUERY_PARAM_KEY.longitude in params;
  }
}
