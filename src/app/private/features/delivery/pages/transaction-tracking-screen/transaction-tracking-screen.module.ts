import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen';

@NgModule({
  imports: [CommonModule, TransactionTrackingScreenRoutingModule],
  declarations: [transactionTrackingScreenRoutedComponents],
})
export class TransactionTrackingScreenModule {}
