import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/zip';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie';
import { AdKeyWords } from './ad.interface';
import * as moment from 'moment';
import { HttpService } from '../http/http.service';
import { User } from '../user/user';;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AdService {

  public allowSegmentation$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;
  private _adSlots = [
    { name: '/130868815/chat_right', id: 'div-gpt-ad-1508490196308-0', sizes: [[240, 400], [120, 600], [160, 600], [300, 250]], 'zoneid': 978109}
  ];
  private _bidTimeout = 2000;

  constructor(private http: HttpService,
              private userService: UserService,
              private cookieService: CookieService
  ) {
    this.initKeyWordsFromCookies();
    this.initPositionKeyWords();
    this.initGoogletagConfig();

    __cmp('getConsentData', 1, () => {
      __cmp('getVendorConsents', [11], (ventorConsents) => {
        let allowSegmentation = false;
        if (!ventorConsents.gdprApplies || ventorConsents.purposeConsents[2]) {
          allowSegmentation = ventorConsents.gdprApplies ? true : false;
        }
        this.allowSegmentation$.next(allowSegmentation);
      });
    });
  }

  private initKeyWordsFromCookies() {
    this.adKeyWords.brand = this.cookieService.get('brand');
    this.adKeyWords.content = this.cookieService.get('content');
    this.adKeyWords.category = this.cookieService.get('category');
    this.adKeyWords.minprice = this.cookieService.get('minprice');
    this.adKeyWords.maxprice = this.cookieService.get('maxprice');
  }

  private initPositionKeyWords() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.adKeyWords.latitude = position.coords.latitude.toString();
        this.adKeyWords.longitude = position.coords.longitude.toString();
      });
    }
  }

  private initGoogletagConfig () {
    googletag.cmd.push(() => {
      this._adSlots.forEach((slot) => {
        googletag.defineSlot(slot.name, slot.sizes, slot.id)
          .setTargeting('ad_group', Adomik.randomAdGroup())
          .setTargeting('ad_h', (new Date).getUTCHours().toString())
          .addService(googletag.pubads());
      });
      let publisherId = this.cookieService.get('publisherId');
      publisherId = publisherId ? publisherId : '-1' + Array(31).join('0');
      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      googletag.pubads().disableInitialLoad();
      googletag.pubads().setPublisherProvidedId(publisherId);
      googletag.enableServices();
    });
  }

  public fetchHeaderBids(allowSegmentation = false) {
    merge(this.requestBidAps(), this.requestBidCriteo())
      .subscribe(null, null, () => {
        this.sendAdServerRequest(allowSegmentation);
      });
  }

  public requestBidAps() {
    const apstagSlots = this._adSlots.map((slot) => {
      return { slotID: slot.id, sizes: slot.sizes, slotName: slot.name};
    });
    return Observable.create((observer) => {
      apstag.fetchBids({
        slots: apstagSlots,
        timeout: this._bidTimeout
      }, (bids) => {
        observer.complete();
      });
    });
  }

  public requestBidCriteo() {
    const adUnits = {
      placements: this._adSlots.map((slot) => {
        return { slotid: slot.id, zoneid: slot.zoneid};
      })
    };
    return Observable.create((observer) => {
      Criteo.events.push(() => {
        Criteo.SetLineItemRanges('0..4.5:0.01;4.50..27:0.05;27..72:0.1');
        Criteo.RequestBids(adUnits, (bids) => {
          observer.complete();
        }, this._bidTimeout);
      });
    });
  }

  public sendAdServerRequest(allowSegmentation = false) {
    googletag.cmd.push(() => {
      apstag.setDisplayBids();
      Criteo.SetDFPKeyValueTargeting();
      googletag.pubads().setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
      googletag.pubads().refresh();
    });
  }

  public startAdsRefresh(): void {
    if (this.adsRefreshSubscription && !this.adsRefreshSubscription.closed) { return ; }
    this.adsRefreshSubscription = this.userService.me().do((user: User) => {
      this.adKeyWords.gender = user.gender;
      this.adKeyWords.userId = user.id;
      if (user.birthDate) {
        this.adKeyWords.age = moment().diff(user.birthDate, 'years').toString();
      }
      if (!this.adKeyWords.latitude && user.location) {
        this.adKeyWords.latitude = user.location.approximated_latitude.toString();
      }
      if (!this.adKeyWords.longitude && user.location) {
        this.adKeyWords.longitude = user.location.approximated_longitude.toString();
      }
    }).flatMap(() => {
      return this.allowSegmentation$.filter((value) =>  value !== null);
    }).subscribe((allowSegmentation: boolean) => {
      this.refreshAdWithKeyWords(allowSegmentation);
    });
  }

  private refreshAdWithKeyWords(allowSegmentation: boolean): void {
    Object.keys(this.adKeyWords).forEach((key) => {
      googletag.pubads().setTargeting(key, this.adKeyWords[key]);
    });
    googletag.pubads().setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
    this.fetchHeaderBids(allowSegmentation);
  }

  public stopAdsRefresh(): void {
    if (this.adsRefreshSubscription && !this.adsRefreshSubscription.closed) {
      this.adsRefreshSubscription.unsubscribe();
    }
  }

}
