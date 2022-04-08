import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { DeliveryExperimentalFeaturesService } from '@private/core/services/delivery-experimental-features/delivery-experimental-features.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DeliveryDevelopmentGuard implements CanLoad {
  constructor(private router: Router, private deliveryExperimentalFeaturesService: DeliveryExperimentalFeaturesService) {}

  public canLoad(): Observable<boolean> {
    return this.deliveryExperimentalFeaturesService.featuresEnabled$.pipe(
      tap((enabled) => {
        if (!enabled) {
          this.router.navigate(['/chat']);
        }
      })
    );
  }
}
