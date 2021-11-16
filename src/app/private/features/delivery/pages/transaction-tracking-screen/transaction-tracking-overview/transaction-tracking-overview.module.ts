import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingStatusInfoModule } from '../components/transaction-tracking-status-info/transaction-tracking-status-info.module';
import { TransactionTrackingHeaderModule } from '../components/transaction-tracking-header/transaction-tracking-header.module';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, TransactionTrackingHeaderModule, TransactionTrackingStatusInfoModule],
  providers: [TransactionTrackingService],
})
export class TransactionTrackingOverviewModule {}
