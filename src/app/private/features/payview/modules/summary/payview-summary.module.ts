import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [PayviewSummaryHeaderComponent, PayviewSummaryOverviewComponent],
  providers: [],
  exports: [PayviewSummaryOverviewComponent],
})
export class PayviewSummaryModule {}
