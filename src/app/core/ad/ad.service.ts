import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpService,
} from 'shield';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/timeInterval';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { AdKeyWords } from './ad.interface';
import { User } from 'shield';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE = 'rest/ads/refreshRate';
  public adKeyWords: AdKeyWords = {} as AdKeyWords;

  constructor(private http: HttpService,
              private userService: UserService,
              private cookieService: CookieService
  ) {

    this.adKeyWords.brand = this.cookieService.get('brand');
    this.adKeyWords.content = this.cookieService.get('content');
    this.adKeyWords.category = this.cookieService.get('category');
    this.adKeyWords.minprice = this.cookieService.get('minprice');
    this.adKeyWords.maxprice = this.cookieService.get('maxprice');
  }

  public refreshAds(): Observable<any> {
    return Observable.forkJoin(
      this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
      .flatMap((refreshRate: number) => {
        return refreshRate ? Observable.interval(refreshRate) : Observable.of(refreshRate)
      }),
      this.userService.me().map((user: User) => {
        this.adKeyWords.gender = user.gender;
      })
    )
  }

}
