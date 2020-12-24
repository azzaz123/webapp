import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';

@NgModule({
  declarations: [CardComponent],
  imports: [
    CommonModule,
    FavouriteIconModule,
    ItemAvatarModule,
    CustomCurrencyModule,
  ],
  exports: [CardComponent],
})
export class CardModule {}
