import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardListComponent } from './item-card-list.component';
import { ItemCardModule } from '../item-card/item-card.module';

@NgModule({
  declarations: [ItemCardListComponent],
  imports: [CommonModule, ItemCardModule],
  exports: [ItemCardListComponent],
})
export class ItemCardListModule {}
