import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  transactionTrackingInstructionsRoutedComponents,
  TransactionTrackingInstructionsRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-instructions/transaction-tracking-instructions.routing.module';

@NgModule({
  declarations: [transactionTrackingInstructionsRoutedComponents],
  imports: [CommonModule, TransactionTrackingInstructionsRoutingModule],
})
export class TransactionTrackingInstructionsModule {}
