import { Injectable } from '@angular/core';
import { CreditCard } from '@api/core/model';
import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { environment } from '@environments/environment.beta';
import { WebViewModalService } from '@shared/web-view-modal/services/web-view-modal.service';
import { Observable, of, ReplaySubject, timer } from 'rxjs';
import { filter, concatMap, take, takeUntil, tap } from 'rxjs/operators';

const THREE_DOMAIN_SECURE_START_URL = (id: string): string => `${environment.baseUrl}api/v3/payments/cards/start_3ds/${id}`;
type GetCreditCardRequest = (ignoreInvalidCard: boolean) => Observable<CreditCard>;

@Injectable({
  providedIn: 'root',
})
export class ThreeDomainSecureService {
  private readonly processCompleted: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private featureFlagService: FeatureFlagService, private webViewModalService: WebViewModalService) {}

  public checkThreeDomainSecure(getCreditCardRequest: GetCreditCardRequest): Observable<void> {
    this.isThreeDSecureEnabled()
      .pipe(
        filter((enabled) => enabled),
        concatMap(() =>
          this.checkCardUntilKnownStatus(getCreditCardRequest).pipe(
            concatMap((card) => (this.isPending3DSCard(card) ? this.start3DSValidation(card) : of(card)))
          )
        )
      )
      .subscribe({ complete: () => this.triggerSuccessfull3DS() });

    return this.processCompleted;
  }

  public cardNeedsToBeRemoved(card: CreditCard): boolean {
    return this.isInvalidCard(card) || this.isPending3DSCard(card);
  }

  private checkCardUntilKnownStatus(getCreditCard: GetCreditCardRequest): Observable<CreditCard> {
    const checkIntervalMs = 1000;
    const maxChecks = 30;
    const checkCardSubject: ReplaySubject<CreditCard> = new ReplaySubject<CreditCard>();

    timer(0, checkIntervalMs)
      .pipe(
        tap(() => {
          getCreditCard(true)
            .pipe(filter((card) => card.status !== CREDIT_CARD_STATUS.UNKNOWN))
            .subscribe((card) => {
              checkCardSubject.next(card);
              checkCardSubject.complete();
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
    const modalDoneSubject: ReplaySubject<void> = new ReplaySubject<void>();

    const modalDoneTrigger = () => {
      modalDoneSubject.next();
      modalDoneSubject.complete();
    };

    const { id } = card;
    const threeDSecureStartUrl: string = THREE_DOMAIN_SECURE_START_URL(id);
    this.webViewModalService.open(threeDSecureStartUrl).subscribe({ next: modalDoneTrigger, complete: modalDoneTrigger });

    return modalDoneSubject;
  }

  private isInvalidCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.INVALID;
  }

  private isPending3DSCard(card: CreditCard): boolean {
    return card.status === CREDIT_CARD_STATUS.PENDING_3DS;
  }

  private triggerSuccessfull3DS = () => {
    this.processCompleted.next();
    this.processCompleted.complete();
  };
}
