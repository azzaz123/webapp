import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PayviewSummaryHeaderComponent, PayviewSummaryOverviewComponent],
  providers: [],
  exports: [PayviewSummaryOverviewComponent],
})
export class PayviewSummaryModule {}
