import { NgModule } from '@angular/core';
import { ItemSalePriceHttpService } from './http/item-sale-price-http.service';
import { ItemSalePriceApiService } from './item-sale-price-api.service';

@NgModule({
  providers: [ItemSalePriceHttpService, ItemSalePriceApiService],
})
export class ItemSalePriceApiModule {}
