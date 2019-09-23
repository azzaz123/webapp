import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpServiceNew } from '../http/http.service.new';
import { IDictionary } from '../../shared/models/dictionary.interface';

export interface FeatureFlagResponse {
  name: string;
  active: boolean;
}

export const FEATURE_FLAG_ENDPOINT = 'api/v3/featureflag';

@Injectable()
export class FeatureflagService {

  private storedFeatureFlags: FeatureFlagResponse[] = [];

  constructor(private http: HttpServiceNew) {
  }

  public getFlag(name: string): Observable<boolean> {

    const storedFeatureFlag = this.storedFeatureFlags.find(sff => sff.name === name);

    if (storedFeatureFlag) {
      return of(storedFeatureFlag).map(sff => sff.active);
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

      return this.http.get<FeatureFlagResponse[]>(FEATURE_FLAG_ENDPOINT, params)
        .map(response => {
          const featureFlagResponse = response[0] ? response[0] : { name, active: false };
          const alreadyStored = this.storedFeatureFlags.find(sff => sff.name === name);
          if (!alreadyStored) {
            this.storedFeatureFlags.push(featureFlagResponse);
          }
          return featureFlagResponse.active;
        });
    }

  }

  getWebInboxProjections(): Observable<boolean> {
    return this.getFlag('web_inbox_projections');
  }

}
