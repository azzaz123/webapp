import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AdsService } from '../services';
import { NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';

@Injectable({
  providedIn: 'root',
})
export class AdsResolver implements Resolve<void> {
  constructor(private adsService: AdsService, private permissionService: NgxPermissionsService) {}

  resolve(): void {
    if (this.permissionService.getPermission(PERMISSIONS.showAds)) {
      this.adsService.init();
    }
  }
}
