import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

@NgModule({
  imports: [CommonModule, PayviewRoutingModule],
  declarations: [payviewRoutedComponents, PayviewModalComponent],
  providers: [PayviewService, PayviewStateManagementService],
})
export class PayviewModule {}
