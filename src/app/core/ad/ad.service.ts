import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpService,
} from 'shield';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/timer';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { AdKeyWords } from './ad.interface';
import { User } from 'shield';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

@Injectable()
export class AdService {

  private ENDPOINT_REFRESH_RATE = 'rest/ads/refreshRate';
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;

  constructor(private http: HttpService,
              private userService: UserService,
              private cookieService: CookieService
  ) {
    this.initKeyWordsFromCookies();
  }

  private initKeyWordsFromCookies() {
    this.adKeyWords.brand = this.cookieService.get('brand');
    this.adKeyWords.content = this.cookieService.get('content');
    this.adKeyWords.category = this.cookieService.get('category');
    this.adKeyWords.minprice = this.cookieService.get('minprice');
    this.adKeyWords.maxprice = this.cookieService.get('maxprice');
  }

  public startAdsRefresh(): void {
    if (this.adsRefreshSubscription && !this.adsRefreshSubscription.closed) { return ; }
    this.adsRefreshSubscription = this.userService.me().do((user: User) => {
      this.adKeyWords.gender = user.gender;
      this.adKeyWords.userId = user.id;
      if (user.birthDate) {
        this.adKeyWords.age = moment().diff(user.birthDate, 'years').toString();
      }
    }).flatMap(() => {
      return this.http.getNoBase(environment.siteUrl + this.ENDPOINT_REFRESH_RATE).map(res => res.json())
    }).flatMap((refreshRate: number) => {
      return refreshRate ? Observable.timer(0, refreshRate) : Observable.of(0)
    }).subscribe(() => {
      this.refreshAdWithKeyWords();
    });
  }

  private refreshAdWithKeyWords(): void {
    Object.keys(this.adKeyWords).forEach((key) => {
      googletag.pubads().setTargeting(key, this.adKeyWords[key]);
    });
    googletag.pubads().refresh();
  }

  public stopAdsRefresh(): void {
    if (this.adsRefreshSubscription && !this.adsRefreshSubscription.closed) {
      this.adsRefreshSubscription.unsubscribe();
    }
  }

}
