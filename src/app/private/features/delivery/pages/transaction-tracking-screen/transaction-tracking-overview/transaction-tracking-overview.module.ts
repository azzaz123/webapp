import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, ButtonModule],
  providers: [],
})
export class TransactionTrackingOverviewModule {}
