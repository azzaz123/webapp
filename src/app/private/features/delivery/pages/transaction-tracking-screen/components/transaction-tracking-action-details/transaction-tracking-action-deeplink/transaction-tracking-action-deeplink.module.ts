import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailRouteModule } from '@shared/pipes/item-detail-route/item-detail-route.module';
import { UserProfileRouteModule } from '@shared/pipes';
import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';

@NgModule({
  declarations: [TransactionTrackingActionDeeplinkComponent],
  imports: [CommonModule, ItemDetailRouteModule, UserProfileRouteModule],
  exports: [TransactionTrackingActionDeeplinkComponent],
})
export class TransactionTrackingActionDeeplinkModule {}
