import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { ConfirmationActionModalModule } from '../../../modals/confirmation-action-modal/confirmation-action-modal.module';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule, ConfirmationActionModalModule],
  exports: [TransactionTrackingActionDialogComponent],
})
export class TransactionTrackingActionDialogModule {}
