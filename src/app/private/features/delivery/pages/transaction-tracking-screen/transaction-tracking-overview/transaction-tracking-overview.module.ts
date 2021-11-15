import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingStatusInfoModule } from '../components/transaction-tracking-status-info/transaction-tracking-status-info.module';
import { TransactionTrackingHeaderModule } from '../components/transaction-tracking-header/transaction-tracking-header.module';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, TransactionTrackingHeaderModule, TransactionTrackingStatusInfoModule],
})
export class TransactionTrackingOverviewModule {}
