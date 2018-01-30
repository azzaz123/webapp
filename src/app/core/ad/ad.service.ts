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
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE = 'rest/ads/refreshRate';
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;

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

  public startAdsRefresh(): void {
    this.adsRefreshSubscription = this.userService.me().map((user: User) => {
      this.adKeyWords.gender = user.gender;
      return user
    }).flatMap(() => {
      return this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
    }).flatMap((refreshRate: number) => {
      return refreshRate ? Observable.interval(refreshRate) : Observable.of(refreshRate)
    }).subscribe(() => {
      Object.keys(this.adKeyWords).forEach((key) => {
        googletag.pubads().setTargeting(key, this.adKeyWords[key]);
      });
      googletag.pubads().refresh();
    });
  }

  public stopAdsRefresh(): void {
    this.adsRefreshSubscription.unsubscribe();
  }

}
