import { NgModule } from '@angular/core';
import { SalesAsBuyerHttpService } from './http/sales-as-buyer-http.service';
import { SalesAsBuyerApiService } from './sales-as-buyer-api.service';

@NgModule({
  providers: [SalesAsBuyerHttpService, SalesAsBuyerApiService],
})
export class SalesAsBuyerApiModule {}
