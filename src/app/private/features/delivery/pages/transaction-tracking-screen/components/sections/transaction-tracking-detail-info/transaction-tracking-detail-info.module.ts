import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import {
  TransactionDetailModalModule,
  TransactionDetailRedirectionModule,
  TransactionDetailWithoutActionModule,
} from '../../transaction-details';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionDetailWithoutActionModule, TransactionDetailRedirectionModule, TransactionDetailModalModule],
  providers: [TransactionTrackingActionsService],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
