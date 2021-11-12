import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoModule } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-detail-info/transaction-tracking-detail-info.module';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, TransactionTrackingDetailInfoModule],
})
export class TransactionTrackingOverviewModule {}
