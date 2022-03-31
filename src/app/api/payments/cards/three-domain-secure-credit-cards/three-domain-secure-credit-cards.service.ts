import { Injectable } from '@angular/core';
import { CardRegistrationFailedError } from '@api/core/errors/payments/cards';
import { CreditCard } from '@api/core/model';
import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { environment } from '@environments/environment';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, throwError, timer } from 'rxjs';
import { filter, concatMap, take, takeUntil, tap, catchError, map } from 'rxjs/operators';

type GetCreditCardRequest = (ignoreInvalidCard: boolean) => Observable<CreditCard>;

@Injectable({
  providedIn: 'root',
})
export class ThreeDomainSecureCreditCardsService {
  constructor(private webViewModalService: WebViewModalService) {}

  public checkThreeDomainSecure(getCreditCardRequest: GetCreditCardRequest): Observable<void> {
    return this.checkCardUntilKnownStatus(getCreditCardRequest).pipe(
      concatMap((card) => (this.isPending3DSCard(card) ? this.start3DSValidation(card) : of(card))),
      take(1),
      map(() => {})
    );
  }

  public cardNeedsToBeRemoved(card: CreditCard): boolean {
    return this.isInvalidCard(card) || this.isPending3DSCard(card);
  }

  private getCardValidationExternalUrl(id: string): string {
    return `${environment.baseUrl}api/v3/payments/cards/start_3ds/${id}`;
  }

  private checkCardUntilKnownStatus(getCreditCard: GetCreditCardRequest): Observable<CreditCard> {
    const checkIntervalMs: number = 1000;
    const maxChecks: number = 30;
    const checkCardSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>();

    timer(0, checkIntervalMs)
      .pipe(
        tap(() => {
          getCreditCard(true)
            .pipe(filter((card) => card.status !== CREDIT_CARD_STATUS.UNKNOWN))
            .subscribe((card) => {
              checkCardSubject.next(card);
            });
        }),
        takeUntil(checkCardSubject),
        take(maxChecks)
      )
      .subscribe();

    return checkCardSubject;
  }

  private start3DSValidation(card: CreditCard): Observable<void> {
    const { id } = card;
    const threeDSecureStartUrl: string = this.getCardValidationExternalUrl(id);
    const threeDSecureTitle: string = $localize`:@@three3ds_verification_title:Credit card verification`;

    return this.webViewModalService
      .open(threeDSecureStartUrl, threeDSecureTitle, DELIVERY_MODAL_CLASSNAME)
      .pipe(catchError(() => throwError([new CardRegistrationFailedError()])));
  }

  private isInvalidCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.INVALID;
  }

  private isPending3DSCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.PENDING_3DS;
  }
}
