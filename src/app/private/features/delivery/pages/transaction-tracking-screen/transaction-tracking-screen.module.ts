import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedErrorActionModule } from '@shared/error-action';
import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingScreenStoreService } from './services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TransactionTrackingScreenTrackingEventsService } from './services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingModule } from '@api/bff/delivery/transaction-tracking/transaction-tracking.module';

@NgModule({
  imports: [CommonModule, SharedErrorActionModule, TransactionTrackingModule, TransactionTrackingScreenRoutingModule],
  declarations: [transactionTrackingScreenRoutedComponents],
  providers: [TransactionTrackingScreenTrackingEventsService, TransactionTrackingScreenStoreService],
})
export class TransactionTrackingScreenModule {}
