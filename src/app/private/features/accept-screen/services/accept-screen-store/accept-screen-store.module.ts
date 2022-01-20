import { NgModule } from '@angular/core';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';
import { SellerRequestsApiModule } from '@api/delivery/seller/requests/seller-requests-api.module';
import { ItemService } from '@core/item/item.service';
import { AcceptScreenStoreService } from './accept-screen-store.service';

@NgModule({
  imports: [SellerRequestsApiModule],
  providers: [AcceptScreenStoreService, AcceptScreenService, ItemService],
})
export class AcceptScreenStoreModule {}
