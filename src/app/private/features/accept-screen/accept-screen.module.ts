import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './components/accept-screen-modal/accept-screen-modal.component';
import { ItemService } from '@core/item/item.service';
import { SellerRequestsApiModule } from '@api/delivery/seller/requests/seller-requests-api.module';

@NgModule({
  imports: [AcceptScreenRoutingModule, CommonModule, SellerRequestsApiModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent],
  providers: [ItemService],
})
export class AcceptScreenModule {}
