import { NgModule } from '@angular/core';

import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';

@NgModule({
  providers: [DeliveryCostsService, DeliveryCostsHttpService],
})
export class DeliveryCostsModule {}
