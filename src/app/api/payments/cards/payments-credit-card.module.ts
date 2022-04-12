import { NgModule } from '@angular/core';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { PaymentsCreditCardService } from './payments-credit-card.service';
import { ThreeDomainSecureCreditCardsModule } from './three-domain-secure-credit-cards/three-domain-secure-credit-cards.module';

@NgModule({
  imports: [ThreeDomainSecureCreditCardsModule],
  providers: [PaymentsCreditCardService, PaymentsCreditCardHttpService],
})
export class PaymentsCreditCardModule {}
