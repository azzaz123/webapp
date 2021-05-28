import { map, tap } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from './user';

export interface FeatureFlag {
  name: FEATURE_FLAGS_ENUM;
  isActive: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

export enum FEATURE_FLAGS_ENUM {
  DELIVERY = 'web_delivery',
  STRIPE = 'web_stripe',
  VISIBILITY = 'EnableBumps',
}

export const ACTIVE_DEV_FEATURE_FLAGS: FEATURE_FLAGS_ENUM[] = [FEATURE_FLAGS_ENUM.VISIBILITY];

export const featurePermissionConfig: Partial<Record<FEATURE_FLAGS_ENUM, string>> = {
  [FEATURE_FLAGS_ENUM.VISIBILITY]: PERMISSIONS.visibility,
};

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

    if (isDevMode() && ACTIVE_DEV_FEATURE_FLAGS.includes(name)) {
      this.addPermisions(name);
      return of(true);
    }

    if (storedFeatureFlag && cache) {
      return of(storedFeatureFlag).pipe(
        tap((sff) => this.checkPermission(sff)),
        map((sff) => sff.isActive)
      );
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
            this.checkPermission(featureFlag);
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

  private checkPermission(featureFlag: FeatureFlag): void {
    if (featureFlag.isActive) {
      this.addPermisions(featureFlag.name);
    }
  }

  private addPermisions(featureFlag: FEATURE_FLAGS_ENUM): void {
    const permission = featurePermissionConfig[featureFlag];
    if (permission) {
      this.permissionService.addPermission(permission);
    }
  }
}
