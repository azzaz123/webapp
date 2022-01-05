import { NgModule } from '@angular/core';
import { DeliveriesOngoingService } from './deliveries-ongoing.service';
import { DeliveriesOngoingHttpService } from './http/deliveries-ongoing-http.service';

@NgModule({
  providers: [DeliveriesOngoingService, DeliveriesOngoingHttpService],
})
export class DeliveriesOngoingModule {}
