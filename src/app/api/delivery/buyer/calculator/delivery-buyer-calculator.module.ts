import { NgModule } from '@angular/core';

import { DeliveryBuyerCalculatorHttpService } from '@api/delivery/buyer/calculator/http/delivery-buyer-calculator-http.service';
import { DeliveryBuyerCalculatorService } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.service';

@NgModule({
  providers: [DeliveryBuyerCalculatorService, DeliveryBuyerCalculatorHttpService],
})
export class DeliveryBuyerCalculatorModule {}
