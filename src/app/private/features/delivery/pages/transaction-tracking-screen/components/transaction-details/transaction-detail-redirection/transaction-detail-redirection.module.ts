import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../transaction-detail/transaction-detail.module';
import { TransactionDetailRedirectionComponent } from './transaction-detail-redirection.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';

@NgModule({
  declarations: [TransactionDetailRedirectionComponent],
  imports: [CommonModule, TransactionDetailModule, BypassHTMLModule, TransactionTrackingDeeplinkModule],
  exports: [TransactionDetailRedirectionComponent],
})
export class TransactionDetailRedirectionModule {}
