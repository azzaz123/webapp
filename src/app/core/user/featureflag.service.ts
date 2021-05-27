import { map } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from './user';

export interface FeatureFlag {
  name: string;
  isActive: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
  VISIBILITY = 'visibility',
}

@Injectable({
  providedIn: 'root',
})
export class FeatureflagService {
  private storedFeatureFlags: FeatureFlag[] = [];

  constructor(private http: HttpClient, private permissionService: NgxPermissionsService) {}

  public getFlag(name: FEATURE_FLAGS_ENUM, cache = true): Observable<boolean> {
    const storedFeatureFlag = this.storedFeatureFlags.find((sff) => sff.name === name);

    if (name === FEATURE_FLAGS_ENUM.DELIVERY) {
      return of(this.getDeliveryFeatureFlag());
    }

    if (name === FEATURE_FLAGS_ENUM.VISIBILITY) {
      const isEnabled = this.getVisibilityFeatureFlag();
      if (isEnabled) {
        this.addPermisions(PERMISSIONS.visibility);
      }
      return of(isEnabled);
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

  public isExperimentalFeaturesEnabled(): boolean {
    return !!localStorage.getItem('experimentalFeatures');
  }

  private getDeliveryFeatureFlag(): boolean {
    return isDevMode() || this.isExperimentalFeaturesEnabled();
  }

  private getVisibilityFeatureFlag(): boolean {
    return localStorage.getItem('visibility') === 'true';
  }

  private addPermisions(permission: string): void {
    this.permissionService.addPermission(permission);
  }
}
