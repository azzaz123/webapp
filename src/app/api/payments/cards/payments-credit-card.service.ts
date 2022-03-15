import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mapPaymentsCreditCardToCreditCard } from '@api/payments/cards/mappers/responses/payments-credit-card.mapper';
import { PaymentsCardsErrorMapper } from '@api/payments/cards/mappers/errors/payments-cards-error-mapper';
import { PaymentsCardsErrorResponseApi } from '@api/payments/cards/dtos/errors/payments-cards-error-response-api.interface';
import { PaymentsCreditCardHttpService } from '@api/payments/cards/http/payments-credit-card-http.service';
import { CardInvalidError } from '@api/core/errors/payments/cards/card-invalid.error';
import { ReplaySubject, Observable, of } from 'rxjs';
import { map, concatMap, tap, catchError, take } from 'rxjs/operators';
import { ThreeDomainSecureService } from './three-domain-secure/three-domain-secure.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsCreditCardService {
  private creditCardSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>(1);
  private errorMapper: PaymentsCardsErrorMapper = new PaymentsCardsErrorMapper();

  constructor(
    private paymentsCreditCardHttpService: PaymentsCreditCardHttpService,
    private threeDomainSecureService: ThreeDomainSecureService
  ) {}

  public get creditCard$(): Observable<CreditCard> {
    return this.creditCardSubject.asObservable();
  }

  private set creditCard(creditCard: CreditCard) {
    this.creditCardSubject.next(creditCard);
  }

  public get(ignoreInvalidCard: boolean = false): Observable<CreditCard> {
    const creditCardGetSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>(1);
    this.creditCardSubject = new ReplaySubject<CreditCard>(1);

    this.paymentsCreditCardHttpService
      .get()
      .pipe(
        map(mapPaymentsCreditCardToCreditCard),
        concatMap((card) => {
          const cardNeedsToBeRemoved: boolean = this.threeDomainSecureService.cardNeedsToBeRemoved(card);
          const validCard: boolean = ignoreInvalidCard || !cardNeedsToBeRemoved;
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

    return creditCardGetSubject.asObservable();
  }

  public create(cardSyncRequest: CreditCardSyncRequest): Observable<void> {
    return this.paymentsCreditCardHttpService.create(cardSyncRequest).pipe(
      concatMap(() => this.threeDomainSecureService.checkThreeDomainSecure(this.get.bind(this))),
      tap(() => this.get(true)),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error)),
      take(1)
    );
  }

  public update(cardSyncRequest: CreditCardSyncRequest): Observable<void> {
    return this.paymentsCreditCardHttpService.update(cardSyncRequest).pipe(
      concatMap(() => this.threeDomainSecureService.checkThreeDomainSecure(this.get.bind(this))),
      tap(() => this.get(true)),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error)),
      take(1)
    );
  }

  public delete(): Observable<null> {
    return this.paymentsCreditCardHttpService.delete().pipe(
      tap(() => (this.creditCard = null)),
      catchError((error: PaymentsCardsErrorResponseApi) => this.errorMapper.map(error))
    );
  }
}
