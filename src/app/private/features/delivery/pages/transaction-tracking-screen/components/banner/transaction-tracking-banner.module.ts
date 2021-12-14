import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';

@NgModule({
  declarations: [TransactionTrackingBannerComponent],
  imports: [BypassHTMLModule, CommonModule],
  exports: [TransactionTrackingBannerComponent],
})
export class TransactionTrackingBannerModule {}
