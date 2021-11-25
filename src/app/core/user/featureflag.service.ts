import { map, tap } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { FeatureFlag, FEATURE_FLAGS_ENUM, featurePermissionConfig } from './featureflag-constants';
import { PERMISSIONS } from './user-constants';

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';
export const FEATURE_FLAG_ACCEPT_HEADER = 'application/vnd.featureflag-v2+json';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private storedFeatureFlags: FeatureFlag[] = [];

  constructor(private http: HttpClient, private permissionService: NgxPermissionsService) {}

  public getFlag(name: FEATURE_FLAGS_ENUM, cache = true): Observable<boolean> {
    const storedFeatureFlag = this.storedFeatureFlags.find((sff) => sff.name === name);

    if (storedFeatureFlag && cache) {
      return of(storedFeatureFlag).pipe(
        tap((sff) => this.checkPermission(sff.name, sff.active)),
        map((sff) => sff.active)
      );
    } else {
      return this.http
        .get<FeatureFlag[]>(`${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`, {
          headers: { Accept: FEATURE_FLAG_ACCEPT_HEADER },
          params: {
            featureFlags: name.toString(),
            timestamp: new Date().getTime().toString(), // Prevent browser cache with timestamp parameter
          },
        })
        .pipe(
          map((response) => {
            const featureFlag = response[0] ? { name, active: response[0].active } : { name, active: false };
            const alreadyStored = this.storedFeatureFlags.find((sff) => sff.name === name);
            if (!alreadyStored) {
              this.storedFeatureFlags.push(featureFlag);
            }
            this.checkPermission(featureFlag.name, featureFlag.active);
            return featureFlag.active;
          })
        );
    }
  }

  public getStoredFlag(name: FEATURE_FLAGS_ENUM): FeatureFlag {
    const storedFeatureFlag = this.storedFeatureFlags.find((sff) => sff.name === name);

    if (storedFeatureFlag) {
      this.checkPermission(storedFeatureFlag.name, storedFeatureFlag.active);
    }

    return storedFeatureFlag;
  }

  public getFlags(names: FEATURE_FLAGS_ENUM[], cache = true): Observable<FeatureFlag[]> {
    const featureFlags: FeatureFlag[] = [];
    const flagsToRequest: FEATURE_FLAGS_ENUM[] = [];
    names.forEach((name) => {
      const storedFeatureFlag = this.getStoredFlag(name);
      if (storedFeatureFlag !== null || (storedFeatureFlag !== undefined && cache)) {
        featureFlags.push(storedFeatureFlag);
      } else {
        flagsToRequest.push(name);
      }
    });

    if (cache && featureFlags.length === names.length) {
      return of(featureFlags);
    }

    return this.http
      .get<FeatureFlag[]>(`${environment.baseUrl}${FEATURE_FLAG_ENDPOINT}`, {
        headers: { Accept: FEATURE_FLAG_ACCEPT_HEADER },
        params: {
          featureFlags: flagsToRequest,
          timestamp: new Date().getTime().toString(), // Prevent browser cache with timestamp parameter
        },
      })
      .pipe(
        map((response) => {
          response.forEach((featureFlag) => {
            this.checkPermission(featureFlag.name, featureFlag.active);
          });
          this.storedFeatureFlags.push(...response);
          featureFlags.push(...response);
          return featureFlags;
        })
      );
  }

  // TODO add permissions if is required
  public getLocalFlag(name: FEATURE_FLAGS_ENUM): Observable<boolean> {
    if (name === FEATURE_FLAGS_ENUM.DELIVERY) {
      return of(this.getDeliveryFeatureFlag());
    }
    return of(false);
  }

  public isExperimentalFeaturesEnabled(): boolean {
    return !!localStorage.getItem('experimentalFeatures');
  }

  private getDeliveryFeatureFlag(): boolean {
    return this.isExperimentalFeaturesEnabled();
  }

  private checkPermission(featureFlagName: FEATURE_FLAGS_ENUM, isFlagActive: boolean): void {
    const permissionConfig = featurePermissionConfig[featureFlagName];
    if (permissionConfig) {
      const { permission, statusMapper } = permissionConfig;
      statusMapper(isFlagActive) ? this.addPermissions(permission) : this.removePermissions(permission);
    }
  }

  private addPermissions(permission: PERMISSIONS): void {
    this.permissionService.addPermission(permission);
  }

  private removePermissions(permission: PERMISSIONS): void {
    this.permissionService.removePermission(permission);
  }
}
