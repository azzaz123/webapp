import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import {
  TransactionDetailModalModule,
  TransactionDetailRedirectionModule,
  TransactionDetailWithoutActionModule,
} from '../../transaction-details';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionDetailWithoutActionModule, TransactionDetailRedirectionModule, TransactionDetailModalModule],
  providers: [],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
