import { Injectable } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ShippingToggleService {
  constructor(private featureFlagService: FeatureFlagService) {}

  isActive(): Observable<boolean> {
    return this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.SHIPPING_TOGGLE).pipe(catchError((): Observable<boolean> => of(false)));
  }
}
