import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ButtonModule } from '@shared/button/button.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { ItemFullScreenCarouselComponent } from './item-fullscreen-carousel.component';

@NgModule({
  declarations: [ItemFullScreenCarouselComponent],
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
  exports: [ItemFullScreenCarouselComponent],
  providers: [CheckSessionService, ItemCardService],
})
export class ItemFullScreenCarouselModule {}
