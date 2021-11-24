import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionDetailModalModule,
  TransactionDetailRedirectionModule,
  TransactionDetailWithoutActionModule,
} from '../../transaction-details';
import { TransactionDetailSelectorComponent } from './transaction-detail-selector.component';

@NgModule({
  declarations: [TransactionDetailSelectorComponent],
  imports: [CommonModule, TransactionDetailWithoutActionModule, TransactionDetailRedirectionModule, TransactionDetailModalModule],
  exports: [TransactionDetailSelectorComponent],
})
export class TransactionDetailSelectorModule {}
