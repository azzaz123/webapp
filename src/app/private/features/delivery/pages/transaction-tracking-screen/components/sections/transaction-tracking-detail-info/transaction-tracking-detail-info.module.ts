import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { TransactionDetailModule } from '../../transaction-detail/transaction-detail.module';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionDetailModule],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
