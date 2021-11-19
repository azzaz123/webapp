import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsService } from 'ngx-permissions';
import { SearchAdsService } from '../core/ads/search-ads.service';

@Injectable()
export class SearchAdsResolver implements Resolve<void> {
  constructor(private permissionService: NgxPermissionsService, private searchAdsService: SearchAdsService) {}

  resolve(): void {
    if (this.permissionService.getPermission(PERMISSIONS.showAds)) {
      this.searchAdsService.init();
    }
  }
}
