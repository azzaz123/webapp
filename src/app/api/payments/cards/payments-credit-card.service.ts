import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';
import { mapPaymentsCreditCardToCreditCard } from './mappers/payments-credit-card.mapper';

@Injectable()
export class PaymentsCreditCardService {
  private readonly creditCardSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>(1);

  constructor(private paymentsCreditCardHttpService: PaymentsCreditCardHttpService) {}

  public get creditCard$(): Observable<CreditCard> {
    return this.creditCardSubject.asObservable();
  }

  private set creditCard(creditCard: CreditCard) {
    this.creditCardSubject.next(creditCard);
  }

  public get(): Observable<CreditCard> {
    return this.paymentsCreditCardHttpService.get().pipe(
      map(mapPaymentsCreditCardToCreditCard),
      tap((creditCard) => (this.creditCard = creditCard))
    );
  }

  public create(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.create(cardSyncRequest).pipe(tap(() => this.get()));
  }

  public update(cardSyncRequest: CreditCardSyncRequest): Observable<null> {
    return this.paymentsCreditCardHttpService.update(cardSyncRequest).pipe(tap(() => this.get()));
  }

  public delete(): Observable<null> {
    return this.paymentsCreditCardHttpService.delete().pipe(tap(() => (this.creditCard = null)));
  }
}
