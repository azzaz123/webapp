import { NgModule } from '@angular/core';
import { TransactionTrackingDeeplinkPipe } from './transaction-tracking-deeplink.pipe';

@NgModule({
  declarations: [TransactionTrackingDeeplinkPipe],
  exports: [TransactionTrackingDeeplinkPipe],
})
export class TransactionTrackingDeeplinkModule {}
