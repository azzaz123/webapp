import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CreditCardModule } from '@private/features/wallet/pages/bank-details/pages/credit-card/credit-card.module';
import { DeliveryAddressModule } from '@private/features/delivery/pages/delivery-address/delivery-address.module';
import { DeliveryMapModule } from '@private/shared/delivery-map/delivery-map.module';
import { PayviewDeliveryModule } from '@private/features/payview/modules/delivery/payview-delivery.module';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewPaymentModule } from '@private/features/payview/modules/payment/payview-payment.module';
import { PayviewPromotionModule } from '@private/features/payview/modules/promotion/payview-promotion.module';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewSummaryModule } from '@private/features/payview/modules/summary/payview-summary.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { PayviewBuyModule } from './modules/buy/payview-buy.module';

@NgModule({
  imports: [
    CommonModule,
    PayviewRoutingModule,
    DeliveryAddressModule,
    DeliveryMapModule,
    PayviewBuyModule,
    PayviewSummaryModule,
    PayviewDeliveryModule,
    PayviewPaymentModule,
    PayviewPromotionModule,
    CreditCardModule,
    StepperModule,
    SvgIconModule,
  ],
  declarations: [payviewRoutedComponents, PayviewModalComponent],
})
export class PayviewModule {}
