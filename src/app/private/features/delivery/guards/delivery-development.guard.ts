import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { FeatureflagService } from '@core/user/featureflag.service';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDevelopmentGuard implements CanLoad {
  constructor(private featureflagService: FeatureflagService) {}

  canLoad(): boolean {
    return this.featureflagService.getDeliveryFeatureFlag();
  }
}
