import { NgModule } from '@angular/core';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { PaymentsCreditCardService } from './payments-credit-card.service';
import { ThreeDomainSecureModule } from './three-domain-secure/three-domain-secure.module';

@NgModule({
  imports: [ThreeDomainSecureModule],
  providers: [PaymentsCreditCardService, PaymentsCreditCardHttpService],
})
export class PaymentsCreditCardModule {}
