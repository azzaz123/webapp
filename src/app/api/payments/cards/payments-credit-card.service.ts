import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaymentsCardsErrorResponseApi } from './dtos/errors/payments-cards-error-response-api.interface';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { PaymentsCardsErrorMapper } from './mappers/errors/payments-cards-error-mapper';
import { mapPaymentsCreditCardToCreditCard } from './mappers/responses/payments-credit-card.mapper';

@Injectable()
export class PaymentsCreditCardService {
  private errorMapper: PaymentsCardsErrorMapper = new PaymentsCardsErrorMapper();

  constructor(private paymentsCreditCardHttpService: PaymentsCreditCardHttpService) {}

  public get(): Observable<CreditCard> {
    return this.paymentsCreditCardHttpService.get().pipe(map(mapPaymentsCreditCardToCreditCard));
  }

  public create(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService
      .create(cardSyncRequest)
      .pipe(catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error)));
  }

  public update(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService
      .update(cardSyncRequest)
      .pipe(catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error)));
  }

  public delete(): Observable<null> {
    return this.paymentsCreditCardHttpService
      .delete()
      .pipe(catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error)));
  }
}
