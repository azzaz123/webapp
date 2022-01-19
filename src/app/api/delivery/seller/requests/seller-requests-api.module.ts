import { NgModule } from '@angular/core';
import { SellerRequestsApiService } from './seller-requests-api.service';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';

@NgModule({
  providers: [SellerRequestsApiService, SellerRequestsHttpService],
})
export class SellerRequestsApiModule {}
