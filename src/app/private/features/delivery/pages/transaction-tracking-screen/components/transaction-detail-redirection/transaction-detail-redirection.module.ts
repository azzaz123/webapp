import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../transaction-detail/transaction-detail.module';
import { TransactionDetailRedirectionComponent } from './transaction-detail-redirection.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

@NgModule({
  declarations: [TransactionDetailRedirectionComponent],
  imports: [CommonModule, TransactionDetailModule, BypassHTMLModule],
  exports: [TransactionDetailRedirectionComponent],
})
export class TransactionDetailRedirectionModule {}
