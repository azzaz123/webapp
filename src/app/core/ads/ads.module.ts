import { NgModule } from '@angular/core';
import {
  AdsService,
  AmazonPublisherService,
  CriteoService,
  GooglePublisherTagService,
} from './services';

@NgModule({
  providers: [
    AdsService,
    AmazonPublisherService,
    CriteoService,
    GooglePublisherTagService,
  ],
})
export class AdsModule {}
