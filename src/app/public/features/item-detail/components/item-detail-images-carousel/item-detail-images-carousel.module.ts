import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { SlidesCarouselModule } from '@public/shared/components/slides-carousel/slides-carousel.module';
import { ButtonModule } from '@shared/button/button.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { ItemDetailImagesCarouselComponent } from './item-detail-images-carousel.component';

@NgModule({
  declarations: [ItemDetailImagesCarouselComponent],
  imports: [
    CommonModule,
    FavouriteIconModule,
    SlidesCarouselModule,
    ButtonModule,
    SvgIconModule,
    CustomCurrencyModule,
    PinchZoomModule,
    RouterModule,
  ],
  exports: [ItemDetailImagesCarouselComponent],
  providers: [CheckSessionService, ItemCardService],
})
export class ItemDetailImagesCarouselModule {}
