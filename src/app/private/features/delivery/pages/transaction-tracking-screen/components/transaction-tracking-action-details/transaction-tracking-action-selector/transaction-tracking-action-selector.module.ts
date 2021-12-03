import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionSelectorComponent } from './transaction-tracking-action-selector.component';
import {
  TransactionTrackingActionDeeplinkModule,
  TransactionTrackingActionDialogModule,
  TransactionTrackingActionTrackingWebviewModule,
  TransactionTrackingActionUserActionModule,
} from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-action-details';

@NgModule({
  declarations: [TransactionTrackingActionSelectorComponent],
  imports: [
    CommonModule,
    TransactionTrackingActionDeeplinkModule,
    TransactionTrackingActionDialogModule,
    TransactionTrackingActionTrackingWebviewModule,
    TransactionTrackingActionUserActionModule,
  ],
  exports: [TransactionTrackingActionSelectorComponent],
})
export class TransactionTrackingActionSelectorModule {}
