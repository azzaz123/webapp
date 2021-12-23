import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import {
  TransactionTrackingGeneralInfoModule,
  TransactionTrackingHeaderModule,
  TransactionTrackingStatusInfoWrapperModule,
} from '../components/sections';
import { TransactionTrackingScreenTrackingEventsService } from '../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingScreenStoreService } from '../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [
    TransactionTrackingOverviewRoutingModule,
    CommonModule,
    TransactionTrackingHeaderModule,
    TransactionTrackingGeneralInfoModule,
    TransactionTrackingStatusInfoWrapperModule,
  ],
  providers: [
    TransactionTrackingService,
    TransactionTrackingHttpService,
    TransactionTrackingScreenTrackingEventsService,
    TransactionTrackingScreenStoreService,
  ],
})
export class TransactionTrackingOverviewModule {}
