import { NgModule } from '@angular/core';
import { DeliveryItemDetailsApiModule } from '@api/bff/delivery/items/detail/delivery-item-details-api.module';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryConversationContextService } from './services/delivery-conversation-context/delivery-conversation-context.service';
import { DeliveryConversationContextAsBuyerService } from './services/delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from './services/delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';
import { TRXAwarenessModalModule } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.module';
import { ContinueDeliveryPaymentModule } from '@private/shared/continue-delivery-payment/continue-delivery-payment.module';

@NgModule({
  imports: [BuyerRequestsApiModule, DeliveryItemDetailsApiModule, TRXAwarenessModalModule, ContinueDeliveryPaymentModule],
  providers: [DeliveryConversationContextAsBuyerService, DeliveryConversationContextAsSellerService, DeliveryConversationContextService],
})
export class DeliveryConversationContextModule {}
