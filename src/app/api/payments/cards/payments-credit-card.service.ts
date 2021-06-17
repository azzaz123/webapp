import { Injectable } from '@angular/core';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { mapPaymentsCreditCardToCreditCard } from './mappers/payments-credit-card.mapper';

@Injectable({
  providedIn: 'root',
})
export class PaymentsCreditCardService {
  constructor(private paymentsCreditCardHttpService: PaymentsCreditCardHttpService) {}

  public get(): Observable<CreditCard> {
    return this.paymentsCreditCardHttpService.get().pipe(map(mapPaymentsCreditCardToCreditCard));
  }
}
