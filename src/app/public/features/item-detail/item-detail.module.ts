import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { AdsModule } from '@public/shared/components/ads/ads.module';
import { ItemImagesCarouselModule } from '@public/shared/components/item-images-carousel/item-images-carousel.module';
import { AdModule } from '@shared/ad/ad.module';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SocialShareModule } from '@shared/social-share/social-share.module';
import { MapItemService } from '../public-profile/pages/user-published/services/map-item/map-item.service';
import { ItemFullScreenCarouselModule } from './components/item-fullscreen-carousel/item-fullscreen-carousel.module';
import { ItemDetailHeaderModule } from './components/item-detail-header/item-detail-header.module';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { ItemSpecificationsModule } from './components/item-specifications/item-specifications.module';
import { RecommendedItemsModule } from './components/recommended-items/recommended-items.module';
import { ItemDetailService } from './core/services/item-detail/item-detail.service';
import { MapSpecificationsService } from './core/services/map-specifications/map-specifications.service';
import { EllapsedTimeModule } from './core/directives/ellapsed-time.module';
import { itemDetailRoutedComponents, ItemDetailRoutingModule } from './item-detail-routing.module';
import { ItemTaxonomiesModule } from './components/item-taxonomies/item-taxonomies.module';
import { ItemExtraInfoComponent } from './components/item-extra-info/item-extra-info.component';
import { ItemDetailStoreService } from './core/services/item-detail-store/item-detail-store.service';
import { MapItemDetailStoreService } from './core/services/map-item-detail-store/map-item-detail-store.service';
import { ItemSocialShareService } from './core/services/item-social-share/item-social-share.service';
import { ItemDetailFlagsStoreService } from './core/services/item-detail-flags-store/item-detail-flags-store.service';
import { MapItemDetailFlagsStoreService } from './core/services/map-item-detail-flags-store/map-item-detail-flags-store.service';

@NgModule({
  declarations: [itemDetailRoutedComponents, ItemExtraInfoComponent],
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    AdsModule,
    AdModule,
    ItemImagesCarouselModule,
    CustomCurrencyModule,
    GeolocationModule,
    SvgIconModule,
    SocialShareModule,
    ItemFullScreenCarouselModule,
    RecommendedItemsModule,
    ItemDetailHeaderModule,
    PublicPipesModule,
    ItemSpecificationsModule,
    EllapsedTimeModule,
    ItemTaxonomiesModule,
  ],
  providers: [
    ItemDetailService,
    ItemApiService,
    PublicUserApiService,
    RecommenderApiService,
    MapItemService,
    SocialMetaTagService,
    MapSpecificationsService,
    ItemDetailStoreService,
    MapItemDetailStoreService,
    ItemSocialShareService,
    ItemDetailFlagsStoreService,
    MapItemDetailFlagsStoreService,
  ],
})
export class ItemDetailModule {}
