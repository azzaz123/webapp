import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';
import { TransactionTrackingStatusInfoModule } from '../../transaction-tracking-status-info/transaction-tracking-status-info.module';

@NgModule({
  declarations: [TransactionTrackingDetailInfoComponent],
  imports: [CommonModule, TransactionTrackingStatusInfoModule],
  exports: [TransactionTrackingDetailInfoComponent],
})
export class TransactionTrackingDetailInfoModule {}
