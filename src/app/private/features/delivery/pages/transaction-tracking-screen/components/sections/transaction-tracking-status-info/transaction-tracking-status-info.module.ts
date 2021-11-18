import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../../transaction-detail/transaction-detail.module';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, TransactionDetailModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
