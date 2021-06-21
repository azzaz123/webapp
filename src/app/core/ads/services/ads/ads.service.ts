import { Injectable } from '@angular/core';
import { AdKeyWords, AdShoppingPageOptions, AdSlotShoppingBaseConfiguration } from '@core/ads/models';
import { AdSlotConfiguration } from '@core/ads/models/ad-slot-configuration';
import { AdSlotId } from '@core/ads/models/ad-slot-id';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '../../vendors';
import { LoadAdsService } from '../load-ads/load-ads.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private readonly refreshEventSubject: Subject<void> = new Subject<void>();
  private readonly setSlotsSubject: BehaviorSubject<AdSlotConfiguration[]> = new BehaviorSubject<AdSlotConfiguration[]>([]);
  private readonly _adsReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get adsReady$(): Observable<boolean> {
    return this._adsReady$.asObservable();
  }

  constructor(
    private didomiService: DidomiService,
    private loadAdsService: LoadAdsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService
  ) {
    this.listenToSlots();
    this.listenerToRefresh();
  }

  public init(): void {
    if (!this._adsReady$.getValue()) {
      this.loadAdsService
        .loadAds()
        .pipe(finalize(() => this._adsReady$.next(true)))
        .subscribe();
    }
  }

  public setSlots(adSlots: AdSlotConfiguration[]): void {
    this.googlePublisherTagService.reset();
    this.setSlotsSubject.next(adSlots);
  }

  public setAdKeywords(adKeywords: AdKeyWords): void {
    this.googlePublisherTagService.setAdKeywords(adKeywords);
  }

  public refresh(): void {
    this.refreshEventSubject.next();
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.adsReady$
      .pipe(
        filter((adsReady: boolean) => adsReady),
        tap(() => this.googlePublisherTagService.displayAdBySlotId(slotId)),
        take(1)
      )
      .subscribe();
  }

  public adSlotLoaded$(adSlot: AdSlotConfiguration): Observable<boolean> {
    return this.googlePublisherTagService.isAdSlotLoaded$(adSlot);
  }

  public displayAdShopping(adShoppingPageOptions: AdShoppingPageOptions, adSlotShopping: AdSlotShoppingBaseConfiguration): void {
    this.adsReady$
      .pipe(
        filter((adsReady: boolean) => adsReady),
        tap(() => this.googlePublisherTagService.displayShopping(adShoppingPageOptions, adSlotShopping)),
        take(1)
      )
      .subscribe();
  }

  private listenToSlots(): void {
    combineLatest([this.adsReady$, this.setSlotsSubject.asObservable()])
      .pipe(
        filter(([adsReady, adSlots]: [boolean, AdSlotConfiguration[]]) => adsReady && adSlots.length > 0),
        map(([_, adSlots]: [boolean, AdSlotConfiguration[]]) => adSlots),
        tap((adSlots: AdSlotConfiguration[]) => this.googlePublisherTagService.setSlots(adSlots)),
        tap(() => this.refresh())
      )
      .subscribe();
  }

  private listenerToRefresh(): void {
    combineLatest([this.adsReady$, this.didomiService.allowSegmentation$(), this.refreshEventSubject.asObservable()])
      .pipe(
        filter(([adsReady]: [boolean, boolean, void]) => adsReady),
        map(([_, allowSegmentation]: [boolean, boolean, void]) => allowSegmentation),
        tap((allowSegmentation: boolean) => {
          this.googlePublisherTagService.setAdsSegmentation(allowSegmentation);
          this.googlePublisherTagService.setTargetingByAdsKeywords(allowSegmentation);
          this.googlePublisherTagService.refreshAds();
        }),
        switchMap(() => this.fetchHeaderBids())
      )
      .subscribe();
  }

  private fetchHeaderBids(): Observable<void> {
    return merge(this.amazonPublisherService.requestBid(this.setSlotsSubject.getValue()), this.criteoService.requestBid());
  }
}
