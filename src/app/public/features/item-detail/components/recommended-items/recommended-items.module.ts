import { NgModule } from '@angular/core';
import { RecommendedItemsComponent } from './recommended-items.component';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RecommendedItemsComponent],
  imports: [ItemCardListModule, CommonModule],
  exports: [RecommendedItemsComponent],
})
export class RecommendedItemsModule {}
