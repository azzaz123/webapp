import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@NgModule({
  declarations: [TransactionTrackingActionDeeplinkComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionDeeplinkComponent],
  providers: [DeeplinkService],
})
export class TransactionTrackingActionDeeplinkModule {}
