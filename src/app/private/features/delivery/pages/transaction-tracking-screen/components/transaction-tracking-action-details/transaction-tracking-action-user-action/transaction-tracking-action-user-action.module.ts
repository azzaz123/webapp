import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';
import { ErrorsService } from '@core/errors/errors.service';
import { TransactionTrackingScreenStoreService } from '../../../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TransactionTrackingActionUserActionComponent],
  imports: [CommonModule, RouterModule],
  exports: [TransactionTrackingActionUserActionComponent],
  providers: [TransactionTrackingService, ErrorsService, TransactionTrackingScreenStoreService],
})
export class TransactionTrackingActionUserActionModule {}
