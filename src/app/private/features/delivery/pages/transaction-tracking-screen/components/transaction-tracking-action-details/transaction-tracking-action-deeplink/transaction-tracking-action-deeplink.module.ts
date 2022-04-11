import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';
import { DeeplinkServiceModule } from '@core/deeplink/deeplink.module';

@NgModule({
  declarations: [TransactionTrackingActionDeeplinkComponent],
  imports: [CommonModule, DeeplinkServiceModule],
  exports: [TransactionTrackingActionDeeplinkComponent],
})
export class TransactionTrackingActionDeeplinkModule {}
