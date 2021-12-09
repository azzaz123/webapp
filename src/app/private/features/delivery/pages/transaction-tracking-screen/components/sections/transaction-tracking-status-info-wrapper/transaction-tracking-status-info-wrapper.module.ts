import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingStatusInfoModule } from '../../transaction-tracking-status-info/transaction-tracking-status-info.module';
import { TransactionTrackingStatusInfoWrapperComponent } from './transaction-tracking-status-info-wrapper.component';

@NgModule({
  declarations: [TransactionTrackingStatusInfoWrapperComponent],
  imports: [CommonModule, TransactionTrackingStatusInfoModule],
  exports: [TransactionTrackingStatusInfoWrapperComponent],
})
export class TransactionTrackingStatusInfoWrapperModule {}
