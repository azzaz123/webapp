import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../transaction-detail/transaction-detail.module';
import { TransactionDetailWithoutActionComponent } from './transaction-detail-without-action.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

@NgModule({
  declarations: [TransactionDetailWithoutActionComponent],
  imports: [CommonModule, TransactionDetailModule, BypassHTMLModule],
  exports: [TransactionDetailWithoutActionComponent],
})
export class TransactionDetailWithoutActionModule {}
