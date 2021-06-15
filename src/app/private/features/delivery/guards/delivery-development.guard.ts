import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureflagService } from '@core/user/featureflag.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DeliveryDevelopmentGuard implements CanLoad {
  constructor(private router: Router, private featureflagService: FeatureflagService) {}

  public canLoad(): Observable<boolean> {
    return this.featureflagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).pipe(
      tap((isActive) => {
        if (!isActive) {
          this.router.navigate(['/chat']);
        }
      })
    );
  }
}
