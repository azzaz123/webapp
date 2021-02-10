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
import { ItemFullSizeCarouselComponent } from './item-fullsize-carousel.component';

@NgModule({
  declarations: [ItemFullSizeCarouselComponent],
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
  exports: [ItemFullSizeCarouselComponent],
  providers: [CheckSessionService, ItemCardService],
})
export class ItemFullSizeCarouselModule {}
