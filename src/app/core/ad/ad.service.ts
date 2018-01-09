import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpService,
} from 'shield';
import { AdsRefreshRate } from './ad.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE: string = 'rest/ads/refreshRate';

  constructor(private http: HttpService
  ) {}

  public getRefreshRate(): Observable<AdsRefreshRate> {
    return this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
  }

}
