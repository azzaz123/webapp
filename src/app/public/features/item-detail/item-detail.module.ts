import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail/item-detail.service';
import { itemDetailRoutedComponents, ItemDetailRoutingModule } from './item-detail-routing.module';
import { AdsModule } from '@public/shared/components/ads/ads.module';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '../public-profile/pages/user-published/services/map-item/map-item.service';
import { ItemImagesCarouselModule } from '@public/shared/components/item-images-carousel/item-images-carousel.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SocialShareModule } from '@shared/social-share/social-share.module';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { ItemFullScreenCarouselModule } from './components/item-fullscreen-carousel/item-fullscreen-carousel.module';
import { RecommendedItemsModule } from './components/recommended-items/recommended-items.module';
import { ItemSpecificationsModule } from './components/item-specifications/item-specifications.module';
import { MapSpecificationsService } from './core/services/map-specifications/map-specifications.service';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    AdsModule,
    ItemImagesCarouselModule,
    CustomCurrencyModule,
    GeolocationModule,
    SvgIconModule,
    SocialShareModule,
    ItemFullScreenCarouselModule,
    RecommendedItemsModule,
    ItemSpecificationsModule,
  ],
  providers: [
    ItemDetailService,
    ItemApiService,
    PublicUserApiService,
    RecommenderApiService,
    MapItemService,
    SocialMetaTagService,
    MapSpecificationsService,
  ],
})
export class ItemDetailModule {}
