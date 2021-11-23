import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';
import {
  TransactionDetailModalModule,
  TransactionDetailRedirectionModule,
  TransactionDetailWithoutActionModule,
} from '../../transaction-details';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, TransactionDetailWithoutActionModule, TransactionDetailRedirectionModule, TransactionDetailModalModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
