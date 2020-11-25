import { LoadExternalLibsService } from './../../core/load-external-libs/load-external-libs.service';
import { tap, filter, mergeMap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Observable,
  merge,
  Subscription,
  BehaviorSubject,
  Subscriber,
} from 'rxjs';

import { CookieService } from 'ngx-cookie';
import { AdKeyWords } from './ads.interface';
import * as moment from 'moment';

import { ADS_SOURCES, initAdsConfig } from './ads.config';
import { DidomiService } from 'app/core/didomi/didomi.service';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  public allowSegmentation$: BehaviorSubject<boolean> = new BehaviorSubject(
    null
  );
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;
  private _adSlots = [
    {
      name: '/130868815/chat_right',
      id: 'div-gpt-ad-1508490196308-0',
      sizes: [
        [240, 400],
        [120, 600],
        [160, 600],
        [300, 250],
      ],
      zoneid: 978109,
    },
  ];
  private _bidTimeout = 2000;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private didomiService: DidomiService,
    private loadExternalLibsService: LoadExternalLibsService
  ) {}

  loadAddsLibs(): void {
    this.loadExternalLibsService
      .loadScript(ADS_SOURCES)
      .subscribe(() => this.initAddsLib());
  }

  private initAddsLib(): void {
    initAdsConfig();
    this.initKeyWordsFromCookies();
    this.initPositionKeyWords();
    this.initGoogletagConfig();

    if (this.didomiService.isReady) {
      this.allowSegmentation$.next(
        this.didomiService.userAllowedSegmentationInAds()
      );
    } else {
      this.didomiService.isReady$.subscribe(() => {
        this.allowSegmentation$.next(
          this.didomiService.userAllowedSegmentationInAds()
        );
      });
    }
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
      navigator.geolocation.getCurrentPosition((position) => {
        this.adKeyWords.latitude = position.coords.latitude.toString();
        this.adKeyWords.longitude = position.coords.longitude.toString();
      });
    }
  }

  private initGoogletagConfig() {
    googletag.cmd.push(() => {
      this._adSlots.forEach((slot) => {
        googletag
          .defineSlot(slot.name, slot.sizes, slot.id)
          .setTargeting('ad_group', Adomik.randomAdGroup())
          .setTargeting('ad_h', new Date().getUTCHours().toString())
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
    merge([this.requestBidAps(), this.requestBidCriteo()])
      .pipe(finalize(() => this.sendAdServerRequest(allowSegmentation)))
      .subscribe();
  }

  public requestBidAps() {
    const apstagSlots = this._adSlots.map((slot) => {
      return { slotID: slot.id, sizes: slot.sizes, slotName: slot.name };
    });
    return new Observable((subscriber: Subscriber<void>) => {
      apstag.fetchBids(
        {
          slots: apstagSlots,
          timeout: this._bidTimeout,
        },
        (bids) => {
          subscriber.complete();
        }
      );
    });
  }

  public requestBidCriteo() {
    const adUnits = {
      placements: this._adSlots.map((slot) => {
        return { slotid: slot.id, zoneid: slot.zoneid };
      }),
    };
    return new Observable((observer: Subscriber<void>) => {
      Criteo.events.push(() => {
        Criteo.SetLineItemRanges('0..4.5:0.01;4.50..27:0.05;27..72:0.1');
        Criteo.RequestBids(
          adUnits,
          (bids) => observer.complete(),
          this._bidTimeout
        );
      });
    });
  }

  public sendAdServerRequest(allowSegmentation = false) {
    googletag.cmd.push(() => {
      apstag.setDisplayBids();
      Criteo.SetDFPKeyValueTargeting();
      googletag
        .pubads()
        .setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
      googletag.pubads().refresh();
    });
  }

  public adsRefresh(): void {
    if (this.adsRefreshSubscription && !this.adsRefreshSubscription.closed) {
      return;
    }
    this.adsRefreshSubscription = this.userService
      .me()
      .pipe(
        tap((user: User) => {
          this.adKeyWords.gender = user.gender;
          this.adKeyWords.userId = user.id;
          if (user.birthDate) {
            this.adKeyWords.age = moment()
              .diff(user.birthDate, 'years')
              .toString();
          }
          if (!this.adKeyWords.latitude && user.location) {
            this.adKeyWords.latitude = user.location.approximated_latitude.toString();
          }
          if (!this.adKeyWords.longitude && user.location) {
            this.adKeyWords.longitude = user.location.approximated_longitude.toString();
          }
        }),
        mergeMap(() => {
          return this.allowSegmentation$.pipe(
            filter((value) => value !== null)
          );
        })
      )
      .subscribe((allowSegmentation: boolean) => {
        this.refreshAdWithKeyWords(allowSegmentation);
      });
  }

  private refreshAdWithKeyWords(allowSegmentation: boolean): void {
    Object.keys(this.adKeyWords).forEach((key) => {
      googletag.pubads().setTargeting(key, this.adKeyWords[key]);
    });
    googletag
      .pubads()
      .setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
    this.fetchHeaderBids(allowSegmentation);
  }
}
