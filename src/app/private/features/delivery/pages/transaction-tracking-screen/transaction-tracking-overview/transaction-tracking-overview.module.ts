import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { TransactionTrackingHeaderModule } from '../components/transaction-tracking-header/transaction-tracking-header.module';
import { CommonModule } from '@angular/common';
import { TransactionTrackingGeneralInfoModule } from '../components/transaction-tracking-general-info/transaction-tracking-general-info.module';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, TransactionTrackingHeaderModule, TransactionTrackingGeneralInfoModule],
})
export class TransactionTrackingOverviewModule {}
