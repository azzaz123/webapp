import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';

@NgModule({
  declarations: [ItemCardComponent],
  imports: [
    CommonModule,
    FavouriteIconModule,
    CustomCurrencyModule,
    SvgIconModule,
    SanitizedBackgroundModule,
  ],
  exports: [ItemCardComponent],
})
export class ItemCardModule {}
