import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PayviewSummaryModule } from '@private/features/payview/modules/summary/payview-summary.module';

@NgModule({
  imports: [CommonModule, PayviewRoutingModule, PayviewSummaryModule],
  declarations: [payviewRoutedComponents, PayviewOverviewComponent],
  providers: [PayviewService, PayviewStateManagementService],
})
export class PayviewModule {}
