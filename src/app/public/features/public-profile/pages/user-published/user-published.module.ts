import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { UserPublishedComponent } from './user-published.component';
import { MapPublishedItemCardService } from '../../core/services/map-published-item-card/map-published-item-card.service';
import { EmptyStateModule } from '@public/shared/components/empty-state/empty-state.module';

@NgModule({
  imports: [CommonModule, SpinnerModule, ItemCardListModule, ButtonModule, EmptyStateModule],
  declarations: [UserPublishedComponent],
  providers: [MapPublishedItemCardService],
  exports: [UserPublishedComponent],
})
export class UserPublishedModule {}
