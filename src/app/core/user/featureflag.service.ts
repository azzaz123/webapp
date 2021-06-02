import { map, tap } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { FeatureFlag, FEATURE_FLAGS_ENUM, ACTIVE_DEV_FEATURE_FLAGS, featurePermissionConfig } from './featureflag-constants';
import { PERMISSIONS } from './user-constants';

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

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
      const permission = featurePermissionConfig[name];
      if (permission) {
        this.addPermisions(permission);
      }
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
    const permission = featurePermissionConfig[featureFlag.name];
    if (permission) {
      featureFlag.isActive ? this.addPermisions(permission) : this.removePermisions(permission);
    }
  }

  private addPermisions(permission: PERMISSIONS): void {
    this.permissionService.addPermission(permission);
  }

  private removePermisions(permission: PERMISSIONS): void {
    this.permissionService.removePermission(permission);
  }
}
