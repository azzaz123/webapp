import { NgModule } from '@angular/core';
import { ItemDetailRoutePipe } from './item-detail-route.pipe';

@NgModule({
  declarations: [ItemDetailRoutePipe],
  exports: [ItemDetailRoutePipe],
  providers: [ItemDetailRoutePipe],
})
export class ItemDetailRouteModule {}
