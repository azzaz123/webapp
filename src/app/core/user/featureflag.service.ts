import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpServiceNew } from '../http/http.service.new';
import { IDictionary } from '../../shared/models/dictionary.interface';

export interface FeatureFlag {
  name: string;
  isActive: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

export enum FEATURE_FLAGS_ENUM {
  STRIPE = 'web_stripe',
  SUBSCRIPTIONS = 'web_subscriptions'
}

@Injectable()
export class FeatureflagService {

  private storedFeatureFlags: FeatureFlag[] = [];

  constructor(private http: HttpServiceNew) {
  }

  public getFlag(name: FEATURE_FLAGS_ENUM, cache = true): Observable<boolean> {
    const storedFeatureFlag = this.storedFeatureFlags.find(sff => sff.name === name);

    if (storedFeatureFlag && cache) {
      return of(storedFeatureFlag).map(sff => sff.isActive);
    } else {
      const params: IDictionary[] = [
        {
          key: 'featureFlags',
          value: name
        },
        // Prevent browser cache with timestamp parameter
        {
          key: 'timestamp',
          value: new Date().getTime()
        }
      ];

      return this.http.get(FEATURE_FLAG_ENDPOINT, params)
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
