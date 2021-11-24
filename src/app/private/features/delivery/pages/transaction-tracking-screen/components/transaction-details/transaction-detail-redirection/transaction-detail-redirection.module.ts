import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailModule } from '../transaction-detail/transaction-detail.module';
import { TransactionDetailRedirectionComponent } from './transaction-detail-redirection.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { ItemDetailRouteModule } from '@shared/pipes/item-detail-route/item-detail-route.module';
import { UserProfileRouteModule } from '@shared/pipes';

@NgModule({
  declarations: [TransactionDetailRedirectionComponent],
  imports: [
    CommonModule,
    TransactionDetailModule,
    BypassHTMLModule,
    TransactionTrackingDeeplinkModule,
    ItemDetailRouteModule,
    UserProfileRouteModule,
  ],
  exports: [TransactionDetailRedirectionComponent],
})
export class TransactionDetailRedirectionModule {}
