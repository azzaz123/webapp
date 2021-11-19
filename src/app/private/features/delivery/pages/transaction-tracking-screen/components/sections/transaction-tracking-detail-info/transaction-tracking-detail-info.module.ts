import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { TransactionDetailModule } from '../../transaction-detail/transaction-detail.module';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionDetailModule],
  providers: [TransactionTrackingActionsService],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
