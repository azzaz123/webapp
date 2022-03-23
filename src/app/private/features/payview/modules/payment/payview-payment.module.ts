import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { PayviewPaymentHeaderComponent } from '@private/features/payview/modules/payment/components/header/payview-payment-header.component';
import { PayviewPaymentMethodComponent } from '@private/features/payview/modules/payment/components/method/payview-payment-method.component';
import { PayviewPaymentMethodsComponent } from '@private/features/payview/modules/payment/components/methods/payview-payment-methods.component';
import { PayviewPaymentOverviewComponent } from '@private/features/payview/modules/payment/components/overview/payview-payment-overview.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [ButtonModule, CommonModule, DeliveryRadioSelectorModule, SvgIconModule],
  declarations: [
    PayviewPaymentHeaderComponent,
    PayviewPaymentMethodComponent,
    PayviewPaymentMethodsComponent,
    PayviewPaymentOverviewComponent,
  ],
  exports: [PayviewPaymentOverviewComponent],
})
export class PayviewPaymentModule {}
