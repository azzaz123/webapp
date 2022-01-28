import { NgModule } from '@angular/core';
import { BuyerRequestsHttpService } from './http/buyer-requests-http.service';
import { BuyerRequestsApiService } from './buyer-requests-api.service';

@NgModule({
  providers: [BuyerRequestsHttpService, BuyerRequestsApiService],
})
export class BuyerRequestsApiModule {}
