import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

export interface FeatureFlagResponse {
  name: string;
  active: boolean;
}

@Injectable()
export class FeatureflagService {

  protected API_URL = 'api/v3/featureflag';

  constructor(private http: HttpService) { }

  getFlag(name: string): Observable<boolean> {
    return this.http.get(this.API_URL, {featureFlags: name})
      .map((r: Response) => r.json())
      .map((response: FeatureFlagResponse[]) => {
        return response.length ? response[0].active : false;
      })
  }

}
