import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../transaction-detail/transaction-detail.module';
import { TransactionDetailModalComponent } from './transaction-detail-modal.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

@NgModule({
  declarations: [TransactionDetailModalComponent],
  imports: [CommonModule, TransactionDetailModule, BypassHTMLModule],
  exports: [TransactionDetailModalComponent],
})
export class TransactionDetailModalModule {}
