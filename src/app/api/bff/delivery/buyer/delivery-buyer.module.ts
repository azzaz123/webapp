import { NgModule } from '@angular/core';

import { DeliveryBuyerHttpService } from '@api/bff/delivery/buyer/http/delivery-buyer-http.service';
import { DeliveryBuyerService } from '@api/bff/delivery/buyer/delivery-buyer.service';

@NgModule({
  providers: [DeliveryBuyerService, DeliveryBuyerHttpService],
})
export class DeliveryBuyerModule {}
