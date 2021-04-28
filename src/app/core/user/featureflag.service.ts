import { map } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface FeatureFlag {
  name: string;
  isActive: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
}

@Injectable({
  providedIn: 'root',
})
export class FeatureflagService {
  private storedFeatureFlags: FeatureFlag[] = [];

  constructor(private http: HttpClient) {}

  public getFlag(name: FEATURE_FLAGS_ENUM, cache = true): Observable<boolean> {
    const storedFeatureFlag = this.storedFeatureFlags.find((sff) => sff.name === name);

    if (name === FEATURE_FLAGS_ENUM.DELIVERY) {
      return of(this.getDeliveryFeatureFlag());
    }

    if (storedFeatureFlag && cache) {
      return of(storedFeatureFlag).pipe(map((sff) => sff.isActive));
    } else {
      return this.http
        .get(`${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`, {
          params: {
            featureFlags: name.toString(),
            timestamp: new Date().getTime().toString(), // Prevent browser cache with timestamp parameter
          },
        })
        .pipe(
          map((response) => {
            const featureFlag = response[0] ? { name, isActive: response[0].active } : { name, isActive: false };
            const alreadyStored = this.storedFeatureFlags.find((sff) => sff.name === name);
            if (!alreadyStored) {
              this.storedFeatureFlags.push(featureFlag);
            }
            return featureFlag.isActive;
          })
        );
    }
  }

  private isExpermientalFeaturesEnabled(): boolean {
    return !!localStorage.getItem('experimentalFeatures');
  }

  public getDeliveryFeatureFlag(): boolean {
    return isDevMode() || this.isExpermientalFeaturesEnabled();
  }
}
