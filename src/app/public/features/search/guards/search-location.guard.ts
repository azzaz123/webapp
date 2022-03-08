import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, Params, UrlTree } from '@angular/router';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { Observable } from 'rxjs';

@Injectable()
export class SearchLocationGuard implements CanActivate {
  constructor(private router: Router, private locationService: QueryStringLocationService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentParams = route.queryParams;

    if (!this.routeContainLocationParams(currentParams)) {
      const locationParams = this.locationService.getLocationParameters();
      const queryParams = { ...currentParams, ...locationParams };

      this.router.navigate([`/${PUBLIC_PATHS.SEARCH}`], { queryParams, replaceUrl: true });

      return false;
    }
    return true;
  }

  private routeContainLocationParams(params: Params): boolean {
    return FILTER_QUERY_PARAM_KEY.latitude in params && FILTER_QUERY_PARAM_KEY.longitude in params;
  }
}
