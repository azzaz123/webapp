import { NgModule } from '@angular/core';

import { AdsService } from './services';
import { AdsKeywordsService } from './services/ads-keywords/ads-keywords.service';
import { LoadAdsService } from './services/load-ads/load-ads.service';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from './vendors';

@NgModule({
  providers: [AdsService, AdsKeywordsService, LoadAdsService, AmazonPublisherService, CriteoService, GooglePublisherTagService],
})
export class AdsModule {}
