import { CookieService } from 'ngx-cookie';

import { Inject, Injectable } from '@angular/core';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';

import { AdKeyWords, AdSlot, AdSlotId } from '../../models';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  get googletag(): googletag.Googletag {
    return this.window['googletag'];
  }

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private cookieService: CookieService,
    private adsKeywordsService: AdsKeywordsService
  ) {}

  public isLibraryRefDefined(): boolean {
    return !!this.googletag && this.googletag.apiReady;
  }

  public init(adSlots: AdSlot[]): void {
    this.googletag.cmd.push(() => {
      this.definedSlots(adSlots);
      this.setPubads();
      this.googletag.enableServices();
    });
  }

  public setAdsSegmentation(allowSegmentation = false): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
      this.googletag.pubads().refresh();
    });
  }

  public setTargetingByAdsKeywords(allowSegmentation = false): void {
    this.adsKeywordsService.updateAdKeywords();

    const adKeywords: AdKeyWords = this.adsKeywordsService.adKeywords;
    for (const key in adKeywords) {
      if (adKeywords.hasOwnProperty(key)) {
        this.googletag.pubads().setTargeting(key, adKeywords[key]);
      }
    }

    this.googletag.pubads().setTargeting('allowSegmentation', allowSegmentation.toString());
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googletag.cmd.push(() => {
      this.googletag.display(slotId);
    });
  }

  private setPubads(): void {
    this.googletag.pubads().enableSingleRequest();
    this.googletag.pubads().collapseEmptyDivs();
    this.googletag.pubads().disableInitialLoad();

    const publisherId: string = this.getPublisherId();
    this.googletag.pubads().setPublisherProvidedId(publisherId);
  }

  private getPublisherId(): string {
    return this.cookieService.get('publisherId') ?? '-1' + Array(31).join('0');
  }

  private definedSlots(slots: AdSlot[]): void {
    slots.forEach((slot) => {
      this.googletag
        .defineSlot(slot.name, slot.sizes, slot.id)
        .setTargeting('ad_group', 'ad_opt')
        .setTargeting('ad_h', new Date().getUTCHours().toString())
        .addService(this.googletag.pubads());
    });
  }
}
