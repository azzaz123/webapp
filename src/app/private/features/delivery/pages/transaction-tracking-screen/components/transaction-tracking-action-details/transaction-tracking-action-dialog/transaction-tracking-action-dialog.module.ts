import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionDialogComponent],
})
export class TransactionDetailModalModule {}
