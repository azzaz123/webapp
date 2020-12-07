import { Injectable } from '@angular/core';
import { DidomiService } from 'app/core/didomi/didomi.service';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';
import {
  BehaviorSubject,
  merge,
  Observable,
  Observer,
  Subscriber,
  Subscription,
} from 'rxjs';
import { filter, finalize, mergeMap, tap, switchMap } from 'rxjs/operators';
import { LoadExternalLibsService } from './../../core/load-external-libs/load-external-libs.service';
import { ADS_SOURCES, initAdsConfig } from './ads.config';
import { AdKeyWords } from './ads.interface';

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

  public loadAddsLibs(): void {
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

  private initKeyWordsFromCookies(): void {
    this.adKeyWords.brand = this.cookieService.get('brand');
    this.adKeyWords.content = this.cookieService.get('content');
    this.adKeyWords.category = this.cookieService.get('category');
    this.adKeyWords.minprice = this.cookieService.get('minprice');
    this.adKeyWords.maxprice = this.cookieService.get('maxprice');
  }

  private initPositionKeyWords(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.adKeyWords.latitude = position.coords.latitude.toString();
        this.adKeyWords.longitude = position.coords.longitude.toString();
      });
    }
  }

  private initGoogletagConfig(): void {
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
        tap((user: User) => this.updateAdKeywords(user)),
        mergeMap(() => this.allowSegmentation$),
        filter((allowSegmentation: boolean) => allowSegmentation !== null),
        switchMap((allowSegmentation: boolean) =>
          this.refreshAdWithKeyWords(allowSegmentation)
        )
      )
      .subscribe();
  }

  private updateAdKeywords(user: User): void {
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
  }

  private refreshAdWithKeyWords(allowSegmentation: boolean): Observable<void> {
    Object.keys(this.adKeyWords).forEach((key) => {
      googletag.pubads().setTargeting(key, this.adKeyWords[key]);
    });
    googletag
      .pubads()
      .setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
    return this.fetchHeaderBids(allowSegmentation);
  }

  private fetchHeaderBids(allowSegmentation = false): Observable<void> {
    return merge(this.requestBidAps(), this.requestBidCriteo()).pipe(
      finalize(() => this.sendAdServerRequest(allowSegmentation))
    );
  }

  private requestBidAps(): Observable<void> {
    const apstagSlots = this._adSlots.map((slot) => ({
      slotID: slot.id,
      sizes: slot.sizes,
      slotName: slot.name,
    }));
    return new Observable((observer: Subscriber<void>) => {
      const config = {
        slots: apstagSlots,
        timeout: this._bidTimeout,
      };
      apstag.fetchBids(config, () => observer.complete());
    });
  }

  private requestBidCriteo(): Observable<void> {
    const adUnits = {
      placements: this._adSlots.map((slot) => ({
        slotid: slot.id,
        zoneid: slot.zoneid,
      })),
    };
    return new Observable((observer: Subscriber<void>) => {
      Criteo.events.push(() => {
        Criteo.SetLineItemRanges('0..4.5:0.01;4.50..27:0.05;27..72:0.1');
        Criteo.RequestBids(
          adUnits,
          () => observer.complete(),
          this._bidTimeout
        );
      });
    });
  }
}
