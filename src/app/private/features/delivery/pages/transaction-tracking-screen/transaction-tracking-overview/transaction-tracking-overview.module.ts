import { NgModule } from '@angular/core';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { CommonModule } from '@angular/common';
import {
  TransactionTrackingGeneralInfoModule,
  TransactionTrackingHeaderModule,
  TransactionTrackingStatusInfoWrapperModule,
} from '../components/sections';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [
    TransactionTrackingOverviewRoutingModule,
    CommonModule,
    TransactionTrackingHeaderModule,
    TransactionTrackingGeneralInfoModule,
    TransactionTrackingStatusInfoWrapperModule,
  ],
})
export class TransactionTrackingOverviewModule {}
