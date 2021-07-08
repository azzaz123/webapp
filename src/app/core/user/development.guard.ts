import { Injectable, isDevMode } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FeatureFlagService } from './featureflag.service';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentGuard implements CanLoad {
  constructor(private router: Router, private featureFlagService: FeatureFlagService) {}

  public canLoad(): boolean {
    const devEnv = isDevMode() || this.featureFlagService.isExperimentalFeaturesEnabled();
    if (!devEnv) {
      this.router.navigate(['/chat']);
    }
    return devEnv;
  }
}
