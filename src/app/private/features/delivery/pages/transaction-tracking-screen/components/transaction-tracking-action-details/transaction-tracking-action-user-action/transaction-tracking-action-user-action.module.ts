import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';

@NgModule({
  declarations: [TransactionTrackingActionUserActionComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionUserActionComponent],
  providers: [TransactionTrackingService],
})
export class TransactionTrackingActionUserActionModule {}
