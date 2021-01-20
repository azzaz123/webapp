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
  Subscriber,
  Subscription,
} from 'rxjs';
import { filter, finalize, mergeMap, tap, switchMap } from 'rxjs/operators';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { initAdsConfig } from './ads.config';
import { AD_SLOTS } from './constants/ad-slots';
import { ADS_SOURCES } from './constants';
import { AdKeyWords, AdSlotId } from './interfaces';
import { GooglePublisherTagService } from './services/google-publisher-tag.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  public allowSegmentation$: BehaviorSubject<boolean> = new BehaviorSubject(
    null
  );
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;
  private _bidTimeout = 2000;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private didomiService: DidomiService,
    private loadExternalLibsService: LoadExternalLibsService,
    private googlePublisherTagService: GooglePublisherTagService
  ) {}

  public loadAddsLibs(): void {
    this.loadExternalLibsService
      .loadScriptBySource(ADS_SOURCES)
      .subscribe(() => this.initAddsLib());
  }

  private initAddsLib(): void {
    initAdsConfig();
    this.setAdKeywords();
    this.googlePublisherTagService.init(AD_SLOTS);

    this.didomiService
      .userAllowedSegmentationInAds$()
      .subscribe((userAllowed: boolean) =>
        this.allowSegmentation$.next(userAllowed)
      );
  }

  private setAdKeywords(): void {
    this.setAdKeywordsFromCookies();
    this.setAdkeywordsLocation();
  }

  private setAdKeywordsFromCookies(): void {
    const brand = this.cookieService.get('brand');
    const content = this.cookieService.get('content');
    const category = this.cookieService.get('category');
    const minprice = this.cookieService.get('minprice');
    const maxprice = this.cookieService.get('maxprice');

    this.adKeyWords = {
      brand,
      content,
      category,
      minprice,
      maxprice,
    };
  }

  private setAdkeywordsLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.adKeyWords.latitude = position.coords.latitude.toString();
        this.adKeyWords.longitude = position.coords.longitude.toString();
      });
    }
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
    const apstagSlots = AD_SLOTS.map((slot) => ({
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
      placements: AD_SLOTS.map((slot) => ({
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

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googlePublisherTagService.displayAdBySlotId(slotId);
  }
}
