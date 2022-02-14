import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewSummaryModule } from '@private/features/payview/modules/summary/payview-summary.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, PayviewRoutingModule, PayviewSummaryModule, SvgIconModule],
  declarations: [payviewRoutedComponents, PayviewModalComponent],
})
export class PayviewModule {}
