import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingGeneralInfoModule } from '../components/transaction-tracking-general-info/transaction-tracking-general-info.module';
import { TransactionTrackingStatusInfoModule } from '../components/transaction-tracking-status-info/transaction-tracking-status-info.module';
import { TransactionTrackingHeaderModule } from '../components/transaction-tracking-header/transaction-tracking-header.module';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [
    TransactionTrackingOverviewRoutingModule,
    CommonModule,
    TransactionTrackingHeaderModule,
    TransactionTrackingGeneralInfoModule,
    TransactionTrackingStatusInfoModule,
  ],
  providers: [TransactionTrackingService, TransactionTrackingHttpService],
})
export class TransactionTrackingOverviewModule {}
