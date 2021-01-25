import { NgModule } from '@angular/core';

import { AdsService } from './services';
import {
  AmazonPublisherService,
  CriteoService,
  GooglePublisherTagService,
} from './vendors';

@NgModule({
  providers: [
    AdsService,
    AmazonPublisherService,
    CriteoService,
    GooglePublisherTagService,
  ],
})
export class AdsModule {}
