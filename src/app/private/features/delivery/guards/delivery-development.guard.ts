import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FeatureflagService } from '@core/user/featureflag.service';

@Injectable()
export class DeliveryDevelopmentGuard implements CanLoad {
  constructor(private router: Router, private featureflagService: FeatureflagService) {}

  public canLoad(): boolean {
    const deliveryEnv = this.featureflagService.getDeliveryFeatureFlag();

    if (!deliveryEnv) {
      this.router.navigate(['/chat']);
    }

    return deliveryEnv;
  }
}
