import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, FavouriteIconModule],
  exports: [CardComponent],
})
export class CardModule {}
