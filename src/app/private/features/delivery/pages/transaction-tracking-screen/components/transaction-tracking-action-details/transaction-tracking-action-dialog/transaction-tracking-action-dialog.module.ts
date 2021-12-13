import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { ErrorsService } from '@core/errors/errors.service';
import { ConfirmationModalModule } from '@shared/confirmation-modal/confirmation-modal.module';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule, ConfirmationModalModule],
  providers: [ErrorsService],
  exports: [TransactionTrackingActionDialogComponent],
})
export class TransactionTrackingActionDialogModule {}
