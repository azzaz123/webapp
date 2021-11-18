import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingDetailInfoModule } from '../../transaction-tracking-detail-info/transaction-tracking-detail-info.module';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, TransactionTrackingDetailInfoModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
