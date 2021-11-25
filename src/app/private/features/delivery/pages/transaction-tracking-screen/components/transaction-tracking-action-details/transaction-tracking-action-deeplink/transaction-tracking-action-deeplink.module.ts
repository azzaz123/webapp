import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { ItemDetailRouteModule } from '@shared/pipes/item-detail-route/item-detail-route.module';
import { UserProfileRouteModule } from '@shared/pipes';
import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';

@NgModule({
  declarations: [TransactionTrackingActionDeeplinkComponent],
  imports: [CommonModule, TransactionTrackingDeeplinkModule, ItemDetailRouteModule, UserProfileRouteModule],
  exports: [TransactionTrackingActionDeeplinkComponent],
})
export class TransactionDetailRedirectionModule {}
