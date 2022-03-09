import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mapPaymentsCreditCardToCreditCard } from '@api/payments/cards/mappers/responses/payments-credit-card.mapper';
import { PaymentsCardsErrorMapper } from '@api/payments/cards/mappers/errors/payments-cards-error-mapper';
import { PaymentsCardsErrorResponseApi } from '@api/payments/cards/dtos/errors/payments-cards-error-response-api.interface';
import { PaymentsCreditCardHttpService } from '@api/payments/cards/http/payments-credit-card-http.service';

import { map, tap, catchError, concatMap, take } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { CardInvalidError } from '@api/core/errors/payments/cards';

@Injectable({
  providedIn: 'root',
})
export class PaymentsCreditCardService {
  private readonly creditCardSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>(1);
  private errorMapper: PaymentsCardsErrorMapper = new PaymentsCardsErrorMapper();

  constructor(private paymentsCreditCardHttpService: PaymentsCreditCardHttpService) {}

  public get creditCard$(): Observable<CreditCard> {
    return this.creditCardSubject.asObservable();
  }

  private set creditCard(creditCard: CreditCard) {
    this.creditCardSubject.next(creditCard);
  }

  public get(): Observable<CreditCard> {
    const creditCardGetSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>(1);

    this.paymentsCreditCardHttpService
      .get()
      .pipe(
        map(mapPaymentsCreditCardToCreditCard),
        concatMap((card) => {
          const validCard: boolean = !this.isInvalidCard(card);
          if (validCard) {
            return of(card);
          }
          return this.delete().pipe(
            tap(() => {
              const error: CardInvalidError = new CardInvalidError();
              this.creditCardSubject.error(error);
              creditCardGetSubject.error(error);
            })
          );
        })
      )
      .subscribe((creditCard) => {
        this.creditCard = creditCard;
        creditCardGetSubject.next(creditCard);
      });

    return creditCardGetSubject.asObservable().pipe(take(1));
  }

  public create(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.create(cardSyncRequest).pipe(
      tap(() => this.get()),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error))
    );
  }

  public update(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.update(cardSyncRequest).pipe(
      tap(() => this.get()),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error))
    );
  }

  public delete(): Observable<null> {
    return this.paymentsCreditCardHttpService.delete().pipe(
      tap(() => (this.creditCard = null)),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error))
    );
  }

  private isInvalidCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.INVALID;
  }
}
