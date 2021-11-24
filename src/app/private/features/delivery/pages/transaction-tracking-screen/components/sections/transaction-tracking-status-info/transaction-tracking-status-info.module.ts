import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';
import { TransactionDetailSelectorModule } from '../../transaction-details/transaction-detail-selector/transaction-detail-selector.module';

@NgModule({
  declarations: [TransactionTrackingStatusInfoComponent],
  imports: [CommonModule, TransactionDetailSelectorModule],
  exports: [TransactionTrackingStatusInfoComponent],
})
export class TransactionTrackingStatusInfoModule {}
