import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { DeviceService } from '@core/device/device.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MobileOnlyGuard implements CanLoad {
  constructor(private deviceService: DeviceService, private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isMobile = this.deviceService.isMobile();

    if (isMobile) {
      return true;
    }

    this.router.navigate([`/${PRIVATE_PATHS.CATALOG}`]);

    return false;
  }
}
