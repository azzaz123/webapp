import { NgModule } from '@angular/core';
import { DeliveryItemDetailsHttpService } from './http/delivery-item-details-http.service';
import { DeliveryItemDetailsApiService } from './delivery-item-details-api.service';

@NgModule({
  providers: [DeliveryItemDetailsHttpService, DeliveryItemDetailsApiService],
})
export class DeliveryItemDetailsApiModule {}
