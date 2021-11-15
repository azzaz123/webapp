import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { TransactionTrackingHeaderModule } from '../components/transaction-tracking-header/transaction-tracking-header.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, TransactionTrackingHeaderModule],
})
export class TransactionTrackingOverviewModule {}
