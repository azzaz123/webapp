import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DeliveryAddressModule } from '@private/features/delivery/pages/delivery-address/delivery-address.module';
import { PayviewDeliveryModule } from '@private/features/payview/modules/delivery/payview-delivery.module';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewPromotionModule } from '@private/features/payview/modules/promotion/payview-promotion.module';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewSummaryModule } from '@private/features/payview/modules/summary/payview-summary.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    PayviewRoutingModule,
    DeliveryAddressModule,
    PayviewSummaryModule,
    PayviewDeliveryModule,
    PayviewPromotionModule,
    StepperModule,
    SvgIconModule,
  ],
  declarations: [payviewRoutedComponents, PayviewModalComponent],
})
export class PayviewModule {}
