import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';

@NgModule({
  imports: [PayviewRoutingModule, CommonModule],
  declarations: [payviewRoutedComponents, PayviewOverviewComponent],
})
export class PayviewModule {}
