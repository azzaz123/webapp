import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { mapPaymentsCreditCardToCreditCard } from './mappers/responses/payments-credit-card.mapper';

@Injectable()
export class PaymentsCreditCardService {
  constructor(private paymentsCreditCardHttpService: PaymentsCreditCardHttpService) {}

  public get(): Observable<CreditCard> {
    return this.paymentsCreditCardHttpService.get().pipe(map(mapPaymentsCreditCardToCreditCard));
  }

  public create(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.create(cardSyncRequest);
  }

  public update(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.update(cardSyncRequest);
  }

  public delete(): Observable<null> {
    return this.paymentsCreditCardHttpService.delete();
  }
}
