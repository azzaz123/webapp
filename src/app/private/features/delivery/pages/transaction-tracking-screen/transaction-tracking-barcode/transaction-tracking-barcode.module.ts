import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingActionSelectorModule } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.module';
import { TransactionTrackingBannerModule } from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingHeaderModule } from '@private/features/delivery/pages/transaction-tracking-screen/components/sections';
import {
  transactionTrackingBarcodeRoutedComponents,
  TransactionTrackingBarcodeRoutingModule,
} from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-barcode/transaction-tracking-barcode.routing.module';

@NgModule({
  declarations: [transactionTrackingBarcodeRoutedComponents],
  imports: [
    BypassHTMLModule,
    CommonModule,
    TransactionTrackingActionSelectorModule,
    TransactionTrackingBannerModule,
    TransactionTrackingBarcodeRoutingModule,
    TransactionTrackingHeaderModule,
  ],
})
export class TransactionTrackingBarcodeModule {}
