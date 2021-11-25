import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionDialogComponent],
  providers: [TransactionTrackingService],
})
export class TransactionDetailModalModule {}
