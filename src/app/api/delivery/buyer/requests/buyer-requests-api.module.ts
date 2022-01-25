import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerRequestsHttpService } from './http/buyer-requests-http.service';

@NgModule({
  providers: [BuyerRequestsHttpService],
})
export class BuyerRequestsApiModule {}
