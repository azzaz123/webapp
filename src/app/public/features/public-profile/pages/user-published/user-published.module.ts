import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { ItemCardListModule } from './components/item-card-list/item-card-list.module';
import { MapItemService } from './services/map-item/map-item.service';
import { UserPublishedComponent } from './user-published.component';

@NgModule({
  imports: [CommonModule, SpinnerModule, ItemCardListModule, ButtonModule],
  declarations: [UserPublishedComponent],
  providers: [MapItemService],
  exports: [UserPublishedComponent],
})
export class UserPublishedModule {}
