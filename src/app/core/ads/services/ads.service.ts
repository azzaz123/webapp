import { DidomiService } from 'app/core/didomi/didomi.service';
import { Observable, Subscription, merge } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';

import { ADS_SOURCES, AD_SLOTS } from './../constants';
import { AdKeyWords, AdSlotId } from './../interfaces';
import { AmazonPublisherService } from './../services/amazon-publisher.service';
import { CriteoService } from './../services/criteo.service';
import { GooglePublisherTagService } from './../services/google-publisher-tag.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  public adKeyWords: AdKeyWords = {} as AdKeyWords;
  public adsRefreshSubscription: Subscription;
  public allowSegmentation = false;

  constructor(
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

    this.googlePublisherTagService.init(AD_SLOTS);

    this.didomiService
      .userAllowedSegmentationInAds$()
      .subscribe((userAllowed) => (this.allowSegmentation = userAllowed));
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

  public adsRefresh(): void {
    this.googlePublisherTagService.setTargetingByAdsKeywords(
      this.allowSegmentation
    );
    this.fetchHeaderBids()
      .pipe(
        take(1),
        finalize(() =>
          this.googlePublisherTagService.setAdsSegmentation(
            this.allowSegmentation
          )
        )
      )
      .subscribe();
  }

  private fetchHeaderBids(): Observable<void> {
    return merge(
      this.amazonPublisherService.requestBid(AD_SLOTS),
      this.criteoService.requestBid()
    );
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googlePublisherTagService.displayAdBySlotId(slotId);
  }
}
