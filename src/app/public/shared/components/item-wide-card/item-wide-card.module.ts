import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemWideCardComponent } from './item-wide-card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';

@NgModule({
  declarations: [ItemWideCardComponent],
  imports: [CommonModule, FavouriteIconModule, CustomCurrencyModule],
  exports: [ItemWideCardComponent],
})
export class ItemWideCardModule {}
