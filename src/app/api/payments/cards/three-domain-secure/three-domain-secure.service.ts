import { Injectable } from '@angular/core';
import { CardRegistrationFailedError } from '@api/core/errors/payments/cards';
import { CreditCard } from '@api/core/model';
import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { environment } from '@environments/environment';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, throwError, timer } from 'rxjs';
import { filter, concatMap, take, takeUntil, tap, catchError } from 'rxjs/operators';

const THREE_DOMAIN_SECURE_START_URL = (id: string): string => `${environment.baseUrl}api/v3/payments/cards/start_3ds/${id}`;
type GetCreditCardRequest = (ignoreInvalidCard: boolean) => Observable<CreditCard>;

@Injectable({
  providedIn: 'root',
})
export class ThreeDomainSecureService {
  constructor(private featureFlagService: FeatureFlagService, private webViewModalService: WebViewModalService) {}

  public checkThreeDomainSecure(getCreditCardRequest: GetCreditCardRequest): Observable<void> {
    return this.isThreeDSecureEnabled().pipe(
      concatMap((enabled) => {
        if (!enabled) {
          return of(null);
        }
        const threeDSFlow = this.checkCardUntilKnownStatus(getCreditCardRequest).pipe(
          concatMap((card) => (this.isPending3DSCard(card) ? this.start3DSValidation(card) : of(card)))
        );
        return threeDSFlow;
      }),
      take(1)
    );
  }

  public cardNeedsToBeRemoved(card: CreditCard): boolean {
    return this.isInvalidCard(card) || this.isPending3DSCard(card);
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

  private isThreeDSecureEnabled(): Observable<boolean> {
    return this.featureFlagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY);
  }

  private start3DSValidation(card: CreditCard): Observable<void> {
    const { id } = card;
    const threeDSecureStartUrl: string = THREE_DOMAIN_SECURE_START_URL(id);
    return this.webViewModalService.open(threeDSecureStartUrl).pipe(catchError(() => throwError([new CardRegistrationFailedError()])));
  }

  private isInvalidCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.INVALID;
  }

  private isPending3DSCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.PENDING_3DS;
  }
}
