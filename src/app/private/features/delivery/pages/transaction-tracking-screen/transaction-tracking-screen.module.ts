import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedErrorActionModule } from '@shared/error-action';
import {
  transactionTrackingScreenRoutedComponents,
  TransactionTrackingScreenRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen';

@NgModule({
  imports: [CommonModule, SharedErrorActionModule, TransactionTrackingScreenRoutingModule],
  declarations: [transactionTrackingScreenRoutedComponents],
})
export class TransactionTrackingScreenModule {}
