import { NgModule } from '@angular/core';

import { BuyerRequestsItemsDetailsApiService } from '@api/delivery/buyer/requests/buyer-requests-items-details-api.service';
import { BuyerRequestsItemsDetailsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-items-details-http.service';

@NgModule({
  providers: [BuyerRequestsItemsDetailsHttpService, BuyerRequestsItemsDetailsApiService],
})
export class BuyerRequestsItemsDetailsApiModule {}
