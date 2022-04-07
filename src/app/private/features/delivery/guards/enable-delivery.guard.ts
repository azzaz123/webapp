import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DELIVERY_EXPERIMENTAL_FEATURES_KEY } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';

@Injectable()
export class EnableDeliveryGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    localStorage.setItem(DELIVERY_EXPERIMENTAL_FEATURES_KEY, 'true');

    this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`]);

    return false;
  }
}
