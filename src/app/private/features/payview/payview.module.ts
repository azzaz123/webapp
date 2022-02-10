import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';

@NgModule({
  imports: [CommonModule, PayviewRoutingModule],
  declarations: [payviewRoutedComponents, PayviewModalComponent],
})
export class PayviewModule {}
