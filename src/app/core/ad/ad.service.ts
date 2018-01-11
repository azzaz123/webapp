import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpService,
} from 'shield';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/timeInterval';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE = 'rest/ads/refreshRate';

  constructor(private http: HttpService
  ) {}

  public refreshAds(): Observable<any> {
    return this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
      .flatMap((refreshRate: number) => {
        return refreshRate ? Observable.interval(refreshRate) : Observable.empty()
      })
  }

}
