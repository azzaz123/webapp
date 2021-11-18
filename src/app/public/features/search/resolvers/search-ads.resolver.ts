import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class SearchAdsResolver implements Resolve<void> {
  constructor(
    private adsService: AdsService,
    private permissionService: NgxPermissionsService,
    private adsTargetingsService: AdsTargetingsService
  ) {}

  resolve(route: ActivatedRouteSnapshot): void {
    if (this.permissionService.getPermission(PERMISSIONS.showAds)) {
      const queryParams = route.queryParams;
      const searchKeyword = queryParams[FILTER_QUERY_PARAM_KEY.keywords] || null;

      this.adsService.setAdKeywords({ content: searchKeyword });
      this.adsService.init();
    }
  }
}
