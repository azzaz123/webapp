import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardListComponent } from './item-card-list.component';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { ShowSlotPipe } from './pipes/show-slot.pipe';
import { ItemCardWideModule } from '../item-card-wide/item-card-wide.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AdSlotShoppingModule } from '@shared/ads/ad-slot-shopping/ad-slot-shopping.module';

@NgModule({
  declarations: [ItemCardListComponent, ShowSlotPipe],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    ItemCardModule,
    ItemCardWideModule,
    ItemApiModule,
    PublicPipesModule,
    AdSlotShoppingModule,
  ],
  exports: [ItemCardListComponent],
  providers: [ItemCardService],
})
export class ItemCardListModule {}
