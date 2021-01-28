import { NgModule } from '@angular/core';
import { RecommendedItemsComponent } from './recommended-items.component';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';

@NgModule({
  declarations: [RecommendedItemsComponent],
  imports: [ItemCardListModule],
  exports: [RecommendedItemsComponent],
})
export class RecommendedItemsModule {}
