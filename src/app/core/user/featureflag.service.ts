import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface FeatureFlag {
  name: string;
  isActive: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

export enum FEATURE_FLAGS_ENUM {
  STRIPE = 'web_stripe',
  SUBSCRIPTIONS = 'web_subscriptions',
  INBOX_PROJECTIONS = 'web_inbox_projections'
}

@Injectable()
export class FeatureflagService {

  private storedFeatureFlags: FeatureFlag[] = [];

  constructor(private http: HttpClient) {
  }

  public getFlag(name: FEATURE_FLAGS_ENUM, cache = true): Observable<boolean> {
    const storedFeatureFlag = this.storedFeatureFlags.find(sff => sff.name === name);

    if (storedFeatureFlag && cache) {
      return of(storedFeatureFlag).map(sff => sff.isActive);
    } else {
      return this.http.get(environment.baseUrl + FEATURE_FLAG_ENDPOINT, { params: {
        featureFlags: name.toString(),
        timestamp: new Date().getTime().toString() // Prevent browser cache with timestamp parameter
      }})
      .map(response => {
        const featureFlag = response[0] ? { name, isActive: response[0].active } : { name, isActive: false };
        const alreadyStored = this.storedFeatureFlags.find(sff => sff.name === name);
        if (!alreadyStored) {
          this.storedFeatureFlags.push(featureFlag);
        }
        return featureFlag.isActive;
      });
    }

  }
}
