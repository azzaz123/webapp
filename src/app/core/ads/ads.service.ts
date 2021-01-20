import { Injectable } from '@angular/core';
import { DidomiService } from 'app/core/didomi/didomi.service';
import { User } from 'app/core/user/user';
import { UserService } from 'app/core/user/user.service';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { filter, finalize, mergeMap, tap, switchMap } from 'rxjs/operators';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { AD_SLOTS } from './constants/ad-slots';
import { ADS_SOURCES } from './constants';
import { AdKeyWords, AdSlotId } from './interfaces';
import { GooglePublisherTagService } from './services/google-publisher-tag.service';
import { CriteoService } from './services/criteo.service';
import { AmazonPublisherService } from './services/amazon-publisher.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  public allowSegmentation$: BehaviorSubject<boolean> = new BehaviorSubject(
    null
  );
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private didomiService: DidomiService,
    private loadExternalLibsService: LoadExternalLibsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService
  ) {}

  public init(): void {
    this.loadExternalLibsService
      .loadScriptBySource(ADS_SOURCES)
      .subscribe(() => this.loadAdsConfiguration());
  }

  private loadAdsConfiguration(): void {
    if (!this.checkAdsLibraries()) {
      return;
    }

    this.setAdKeywords();
    this.googlePublisherTagService.init(AD_SLOTS);

    this.didomiService
      .userAllowedSegmentationInAds$()
      .subscribe((userAllowed: boolean) =>
        this.allowSegmentation$.next(userAllowed)
      );
  }

  private checkAdsLibraries(): boolean {
    if (!this.googlePublisherTagService.isLibraryRefDefined()) {
      console.warn('Google Publisher Tag could not be loaded');
      return false;
    }

    if (!this.criteoService.isLibraryRefDefined()) {
      console.warn('Criteo could not be loaded');
      return false;
    }

    if (!this.amazonPublisherService.isLibraryRefDefined()) {
      console.warn('Amazon Publisher Service could not be loaded');
      return false;
    }

    this.amazonPublisherService.init();
    return true;
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
    this.googlePublisherTagService.setTargetingByAdsKeywords(
      this.adKeyWords,
      allowSegmentation
    );
    return this.fetchHeaderBids(allowSegmentation);
  }

  private fetchHeaderBids(allowSegmentation = false): Observable<void> {
    return merge(
      this.amazonPublisherService.requestBid(AD_SLOTS),
      this.criteoService.requestBid()
    ).pipe(
      finalize(() =>
        this.googlePublisherTagService.setAdsSegmentation(allowSegmentation)
      )
    );
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googlePublisherTagService.displayAdBySlotId(slotId);
  }
}
