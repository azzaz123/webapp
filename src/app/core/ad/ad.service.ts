import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpService,
} from 'shield';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/interval';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE: string = 'rest/ads/refreshRate';

  constructor(private http: HttpService
  ) {}

  public getRefreshRate(): Observable<number> {
    return this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
      .flatMap((refreshRate: number) => {
        return Observable.interval(refreshRate);
      })
  }

}
