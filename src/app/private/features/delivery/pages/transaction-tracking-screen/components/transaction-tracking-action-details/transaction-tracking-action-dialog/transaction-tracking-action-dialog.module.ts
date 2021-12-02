import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule, SharedModule],
  exports: [TransactionTrackingActionDialogComponent],
})
export class TransactionTrackingActionDialogModule {}
