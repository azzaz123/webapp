import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryAddressApiService } from '@private/features/delivery/services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryBuyerCalculatorHttpService } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-http.service';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';
import { DeliveryBuyerHttpService } from '@api/bff/delivery/buyer/http/delivery-buyer-http.service';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';
import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { ItemService } from '@core/item/item.service';
import { PaymentsCreditCardHttpService } from '@api/payments/cards/http/payments-credit-card-http.service';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PaymentsPaymentMethodsHttpService } from '@api/payments/payment-methods/http/payments-payment-methods-http.service';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';
import { payviewRoutedComponents, PayviewRoutingModule } from '@private/features/payview/payview.routing.module';
import { PayviewService } from '@private/features/payview/services/payview.service';

@NgModule({
  imports: [BuyerRequestsApiModule, PayviewRoutingModule, CommonModule],
  declarations: [payviewRoutedComponents, PayviewOverviewComponent],
  providers: [
    DeliveryAddressService,
    DeliveryAddressApiService,
    DeliveryAddressStoreService,
    DeliveryBuyerService,
    DeliveryBuyerHttpService,
    DeliveryBuyerCalculatorService,
    DeliveryBuyerCalculatorHttpService,
    DeliveryCostsService,
    DeliveryCostsHttpService,
    ItemService,
    PaymentsCreditCardService,
    PaymentsCreditCardHttpService,
    PaymentsPaymentMethodsService,
    PaymentsPaymentMethodsHttpService,
    PaymentsUserPaymentPreferencesService,
    PaymentsUserPaymentPreferencesHttpService,
    PaymentsWalletsService,
    PaymentsWalletsHttpService,
    PayviewService,
  ],
})
export class PayviewModule {}
