import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [
    PayviewSummaryCostDetailComponent,
    PayviewSummaryHeaderComponent,
    PayviewSummaryOverviewComponent,
    PayviewSummaryPaymentMethodComponent,
  ],
  providers: [],
  exports: [PayviewSummaryOverviewComponent],
})
export class PayviewSummaryModule {}
