import { NgModule } from '@angular/core';
import { RecommendedItemsComponent } from './recommended-items.component';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { CommonModule } from '@angular/common';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';

@NgModule({
  declarations: [RecommendedItemsComponent],
  imports: [ItemCardListModule, CommonModule, CheckSessionModule],
  exports: [RecommendedItemsComponent],
  providers: [MapRecommendedItemCardService],
})
export class RecommendedItemsModule {}
