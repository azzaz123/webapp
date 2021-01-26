import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail.service';
import {
  itemDetailRoutedComponents,
  ItemDetailRoutingModule,
} from './item-detail-routing.module';
import { AdsModule } from '@public/shared/components/ads/ads.module';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '../public-profile/pages/user-published/services/map-item/map-item.service';
import { ItemImagesCarouselModule } from '@public/shared/components/item-images-carousel/item-images-carousel.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    AdsModule,
    ItemImagesCarouselModule,
    CustomCurrencyModule,
    SvgIconModule,
  ],
  providers: [
    ItemDetailService,
    ItemApiService,
    PublicUserApiService,
    RecommenderApiService,
    MapItemService,
  ],
})
export class ItemDetailModule {}
