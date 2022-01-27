import { NgModule } from '@angular/core';
import { DeliveryItemDetailsApiModule } from '@api/bff/delivery/items/detail/delivery-item-details-api.module';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryConversationContextService } from './delivery-conversation-context.service';

@NgModule({
  imports: [BuyerRequestsApiModule, DeliveryItemDetailsApiModule],
  providers: [DeliveryConversationContextService],
})
export class DeliveryConversationContextModule {}
