import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';

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
