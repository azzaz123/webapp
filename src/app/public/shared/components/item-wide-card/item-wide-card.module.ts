import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemWideCardComponent } from './item-wide-card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SlidesCarouselModule } from '../carousel-slides/carousel-slides.module';
import { ItemExtraInfoModule } from '@public/shared/components/item-extra-info/item-extra-info.module';
import { DeviceDetectorService } from 'ngx-device-detector';

@NgModule({
  declarations: [ItemWideCardComponent],
  imports: [CommonModule, FavouriteIconModule, CustomCurrencyModule, SlidesCarouselModule, ItemExtraInfoModule],
  exports: [ItemWideCardComponent],
  providers: [DeviceDetectorService],
})
export class ItemWideCardModule {}
