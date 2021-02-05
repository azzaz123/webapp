import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

@NgModule({
  declarations: [ItemCardComponent],
  imports: [CommonModule, FavouriteIconModule, CustomCurrencyModule, SvgIconModule, ImageFallbackModule],
  exports: [ItemCardComponent],
})
export class ItemCardModule {}
