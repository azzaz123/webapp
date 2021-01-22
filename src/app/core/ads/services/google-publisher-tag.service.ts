import { CookieService } from 'ngx-cookie';

import { Injectable } from '@angular/core';

import { AdKeyWords, AdSlot, AdSlotId } from '../interfaces';
import { AdsKeywordsService } from './ads-keywords.service';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  constructor(
    private cookieService: CookieService,
    private adsKeywordsService: AdsKeywordsService
  ) {}

  public init(adSlots: AdSlot[]): void {
    googletag.cmd.push(() => {
      adSlots.forEach((slot) => {
        googletag
          .defineSlot(slot.name, slot.sizes, slot.id)
          .setTargeting('ad_group', 'ad_opt')
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

  public setAdsSegmentation(allowSegmentation = false): void {
    googletag.cmd.push(() => {
      apstag.setDisplayBids();
      googletag
        .pubads()
        .setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
      googletag.pubads().refresh();
    });
  }

  public setTargetingByAdsKeywords(allowSegmentation = false): void {
    this.adsKeywordsService.updateAdKewords();

    const adKeywords: AdKeyWords = this.adsKeywordsService.adKeywords;
    for (const key in adKeywords) {
      if (adKeywords.hasOwnProperty(key)) {
        googletag.pubads().setTargeting(key, adKeywords[key]);
      }
    }

    googletag
      .pubads()
      .setTargeting('allowSegmentation', allowSegmentation ? 'true' : 'false');
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    googletag.cmd.push(() => {
      googletag.display(slotId);
    });
  }

  public isLibraryRefDefined(): boolean {
    return !!googletag;
  }
}
