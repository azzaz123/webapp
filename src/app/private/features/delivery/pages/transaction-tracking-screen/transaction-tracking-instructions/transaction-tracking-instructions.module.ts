import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  transactionTrackingInstructionsRoutedComponents,
  TransactionTrackingInstructionsRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-instructions/transaction-tracking-instructions.routing.module';
import { TransactionTrackingHeaderModule } from '@private/features/delivery/pages/transaction-tracking-screen/components/sections';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

@NgModule({
  declarations: [transactionTrackingInstructionsRoutedComponents],
  imports: [CommonModule, TransactionTrackingHeaderModule, TransactionTrackingInstructionsRoutingModule],
  providers: [TransactionTrackingService, TransactionTrackingHttpService],
})
export class TransactionTrackingInstructionsModule {}
