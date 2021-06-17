import { NgModule } from '@angular/core';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { PaymentsCreditCardService } from './payments-credit-card.service';

@NgModule({
  providers: [PaymentsCreditCardService, PaymentsCreditCardHttpService],
})
export class PaymentsCreditCardModule {}
