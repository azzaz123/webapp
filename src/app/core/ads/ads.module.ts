import { NgModule } from '@angular/core';

import { AdsService } from './services';
import { AdsKeywordsService } from './services/ads-keywords/ads-keywords.service';
import { LoadAdsService } from './services/load-ads/load-ads.service';
import { AdsTargetingsService } from './services/ads-targetings/ads-targetings.service';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from './vendors';

@NgModule({
  providers: [
    AdsService,
    AdsKeywordsService,
    LoadAdsService,
    AmazonPublisherService,
    CriteoService,
    GooglePublisherTagService,
    AdsTargetingsService,
  ],
})
export class AdsModule {}
