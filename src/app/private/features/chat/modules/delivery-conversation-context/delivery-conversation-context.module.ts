import { NgModule } from '@angular/core';
import { DeliveryItemDetailsApiModule } from '@api/bff/delivery/items/detail/delivery-item-details-api.module';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryConversationContextService } from './services/delivery-conversation-context/delivery-conversation-context.service';
import { DeliveryConversationContextAsBuyerService } from './services/delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';

@NgModule({
  imports: [BuyerRequestsApiModule, DeliveryItemDetailsApiModule],
  providers: [DeliveryConversationContextAsBuyerService, DeliveryConversationContextService],
})
export class DeliveryConversationContextModule {}
