import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';

@NgModule({
  declarations: [TransactionTrackingBannerComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingBannerComponent],
})
export class TransactionTrackingBannerModule {}
