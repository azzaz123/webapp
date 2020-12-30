import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemCardListModule } from '@public/core/components/item-card-list/item-card-list.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { MapItemService } from './services/map-item/map-item.service';
import { UserPublishedComponent } from './user-published.component';

@NgModule({
  imports: [CommonModule, SpinnerModule, ItemCardListModule],
  declarations: [UserPublishedComponent],
  providers: [MapItemService],
  exports: [UserPublishedComponent],
})
export class UserPublishedModule {}
