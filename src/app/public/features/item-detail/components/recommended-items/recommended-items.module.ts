import { NgModule } from '@angular/core';
import { RecommendedItemsComponent } from './recommended-items.component';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { CommonModule } from '@angular/common';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';

@NgModule({
  declarations: [RecommendedItemsComponent],
  imports: [ItemCardListModule, CommonModule, CheckSessionModule],
  exports: [RecommendedItemsComponent],
})
export class RecommendedItemsModule {}
