import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { ItemCardService } from './services/item-card.service';

@NgModule({
  declarations: [ItemCardComponent],
  imports: [
    CommonModule,
    FavouriteIconModule,
    CustomCurrencyModule,
    SvgIconModule,
    SanitizedBackgroundModule,
    ItemApiModule,
  ],
  exports: [ItemCardComponent],
  providers: [ItemCardService],
})
export class ItemCardModule {}
