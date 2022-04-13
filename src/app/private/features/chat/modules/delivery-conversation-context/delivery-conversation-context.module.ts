import { NgModule } from '@angular/core';
import { DeliveryItemDetailsApiModule } from '@api/bff/delivery/items/detail/delivery-item-details-api.module';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryConversationContextService } from './services/delivery-conversation-context/delivery-conversation-context.service';
import { DeliveryConversationContextAsBuyerService } from './services/delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from './services/delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';
import { TRXAwarenessModalModule } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.module';
import { DeliveryPaymentReadyModule } from '@private/shared/delivery-payment-ready/delivery-payment-ready.module';

@NgModule({
  imports: [BuyerRequestsApiModule, DeliveryItemDetailsApiModule, TRXAwarenessModalModule, DeliveryPaymentReadyModule],
  providers: [DeliveryConversationContextAsBuyerService, DeliveryConversationContextAsSellerService, DeliveryConversationContextService],
})
export class DeliveryConversationContextModule {}
