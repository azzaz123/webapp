import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  transactionTrackingOverviewRoutedComponents,
  TransactionTrackingOverviewRoutingModule,
} from './transaction-tracking-overview.routing.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

@NgModule({
  declarations: [transactionTrackingOverviewRoutedComponents],
  imports: [TransactionTrackingOverviewRoutingModule, CommonModule, ButtonModule, SvgIconModule],
  providers: [TransactionTrackingActionsService],
})
export class TransactionTrackingOverviewModule {}
