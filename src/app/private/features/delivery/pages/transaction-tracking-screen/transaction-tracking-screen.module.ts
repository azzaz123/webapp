import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedErrorActionModule } from '@shared/error-action';
import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingScreenStoreService } from './services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import { TransactionTrackingScreenTrackingEventsService } from './services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

@NgModule({
  imports: [CommonModule, SharedErrorActionModule, TransactionTrackingScreenRoutingModule],
  declarations: [transactionTrackingScreenRoutedComponents],
  providers: [
    TransactionTrackingService,
    TransactionTrackingHttpService,
    TransactionTrackingScreenTrackingEventsService,
    TransactionTrackingScreenStoreService,
  ],
})
export class TransactionTrackingScreenModule {}
