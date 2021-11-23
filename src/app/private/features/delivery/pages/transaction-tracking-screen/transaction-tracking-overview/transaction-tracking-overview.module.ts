import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import {
  TransactionTrackingDetailInfoModule,
  TransactionTrackingGeneralInfoModule,
  TransactionTrackingHeaderModule,
  TransactionTrackingStatusInfoModule,
} from '../components/sections';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [
    TransactionTrackingOverviewRoutingModule,
    CommonModule,
    TransactionTrackingHeaderModule,
    TransactionTrackingGeneralInfoModule,
    TransactionTrackingStatusInfoModule,
    TransactionTrackingDetailInfoModule,
  ],
  providers: [TransactionTrackingService, TransactionTrackingHttpService],
})
export class TransactionTrackingOverviewModule {}
