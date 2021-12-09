import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';
import { ErrorsService } from '@core/errors/errors.service';

@NgModule({
  declarations: [TransactionTrackingActionUserActionComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionUserActionComponent],
  providers: [TransactionTrackingService, ErrorsService],
})
export class TransactionTrackingActionUserActionModule {}
