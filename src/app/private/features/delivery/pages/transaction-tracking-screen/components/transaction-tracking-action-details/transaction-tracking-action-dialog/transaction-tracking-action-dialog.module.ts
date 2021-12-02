import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDialogComponent } from './transaction-tracking-action-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { ErrorsService } from '@core/errors/errors.service';

@NgModule({
  declarations: [TransactionTrackingActionDialogComponent],
  imports: [CommonModule, SharedModule],
  providers: [ErrorsService],
  exports: [TransactionTrackingActionDialogComponent],
})
export class TransactionTrackingActionDialogModule {}
