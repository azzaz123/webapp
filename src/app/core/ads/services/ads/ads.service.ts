import { DidomiService } from 'app/core/didomi/didomi.service';
import { Observable, Subject, Subscription, combineLatest, merge } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AD_SLOTS } from '@core/ads/constants';
import { AdKeyWords, AdSlotId } from '@core/ads/models';

import {
  AmazonPublisherService,
  CriteoService,
  GooglePublisherTagService,
} from '../../vendors';
import { LoadAdsService } from '../load-ads/load-ads.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;

  private refreshEventSubject: Subject<void> = new Subject<void>();

  constructor(
    private didomiService: DidomiService,
    private loadAdsService: LoadAdsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService
  ) {
    this.listenerToRefresh();
  }

  public init(): void {
    this.loadAdsService
      .loadAds()
      .pipe(tap(() => this.loadAdsService.setSlots(AD_SLOTS)))
      .subscribe();
  }

  public refresh(): void {
    this.refreshEventSubject.next();
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googlePublisherTagService.displayAdBySlotId(slotId);
  }

  private listenerToRefresh(): void {
    combineLatest([
      this.didomiService.userAllowedSegmentationInAds$(),
      this.refreshEventSubject.asObservable(),
    ])
      .pipe(
        tap(([allowSegmentation]: [boolean, void]) =>
          this.googlePublisherTagService.setTargetingByAdsKeywords(
            allowSegmentation
          )
        ),
        switchMap(([allowSegmentation]: [boolean, void]) =>
          this.fetchHeaderBids(allowSegmentation)
        )
      )
      .subscribe();
  }

  private fetchHeaderBids(allowSegmentation: boolean): Observable<void> {
    return merge(
      this.amazonPublisherService.requestBid(AD_SLOTS),
      this.criteoService.requestBid()
    ).pipe(
      finalize(() =>
        this.googlePublisherTagService.setAdsSegmentation(allowSegmentation)
      )
    );
  }
}
