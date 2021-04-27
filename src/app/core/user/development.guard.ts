import { Injectable, isDevMode } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FeatureflagService } from './featureflag.service';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentGuard implements CanLoad {
  constructor(private router: Router, private featureFlagService: FeatureflagService) {}

  public canLoad(): boolean {
    const devEnv = isDevMode() || this.featureFlagService.isExpermientalFeaturesEnabled();
    if (!devEnv) {
      this.router.navigate(['/chat']);
    }
    return devEnv;
  }
}
