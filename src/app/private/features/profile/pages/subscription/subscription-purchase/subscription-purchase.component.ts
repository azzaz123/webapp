import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionAddCard,
  SCREEN_IDS,
  SubscriptionPayConfirmation,
  SubscriptionPaymentButtonAvailable,
  ViewSubscriptionTier,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { PaymentError, STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService, STRIPE_PAYMENT_RESPONSE_EVENT_KEY } from '@core/stripe/stripe.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionResponse, SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from '@private/features/profile/modal/payment-success/payment-success-modal.component';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { COMPONENT_TYPE } from '@shared/profile-pro-billing/profile-pro-billing.component';
import { filter, mergeMap } from 'rxjs/operators';

export const PAYMENT_SUCCESSFUL_CODE = 202;

@Component({
  selector: 'tsl-subscription-purchase',
  templateUrl: './subscription-purchase.component.html',
  styleUrls: ['./subscription-purchase.component.scss'],
})
export class SubscriptionPurchaseComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  @Input() user: User;
  @Output() purchaseSuccessful: EventEmitter<void> = new EventEmitter();
  @Output() unselectSubcription: EventEmitter<void> = new EventEmitter();

  public stripeCards: FinancialCard[];
  public selectedCard: FinancialCard;
  public isInvoiceRequired = false;
  public selectedTier: Tier;
  public paymentError: STRIPE_ERROR;
  public benefits: string[];
  public isLoading: boolean;
  public isRetryPayment = false;
  private _invoiceId: string;
  public INVOICE_COMPONENT_TYPE = COMPONENT_TYPE;
  private readonly errorTextConfig = {
    [STRIPE_ERROR.card_declined]: translations[TRANSLATION_KEY.CARD_NUMBER_INVALID],
    [STRIPE_ERROR.expired_card]: translations[TRANSLATION_KEY.CARD_DATE_INVALID],
    [STRIPE_ERROR.incorrect_cvc]: translations[TRANSLATION_KEY.CARD_CVC_INVALID],
  };

  constructor(
    private stripeService: StripeService,
    private errorService: ErrorsService,
    private subscriptionsService: SubscriptionsService,
    private modalService: NgbModal,
    private scrollIntoViewService: ScrollIntoViewService,
    private eventService: EventService,
    private analyticsService: AnalyticsService,
    private benefitsService: SubscriptionBenefitsService
  ) {}

  ngOnInit(): void {
    this.getAllCards();
    this.selectedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.default_tier_id);
    this.benefits = this.benefitsService.getBenefitsByCategory(this.subscription.category_id);
    this.subscribeStripeEvents();
    this.trackViewSubscriptionTier();
  }

  private subscribeStripeEvents(): void {
    this.eventService.subscribe(STRIPE_PAYMENT_RESPONSE_EVENT_KEY, (response: string | PaymentError) => {
      this.managePaymentResponse(response);
    });
  }

  private managePaymentResponse(paymentResponse: string | PaymentError): void {
    if (typeof paymentResponse === 'string') {
      switch (paymentResponse && paymentResponse.toUpperCase()) {
        case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
          this.paymentSucceeded();
          break;
        }
        case PAYMENT_RESPONSE_STATUS.FAILED: {
          this.requestNewPayment();
          break;
        }
        default: {
          this.isLoading = false;
          this.showError([]);
          break;
        }
      }
    } else {
      this.isLoading = false;
      this.showError([paymentResponse]);
    }
  }

  private managePaymentStatus(response: SubscriptionResponse): void {
    const paymentStatus = response.payment_status.toUpperCase();
    switch (paymentStatus) {
      case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
        this.isRetryPayment = true;
        this._invoiceId = response.latest_invoice_id;
        this.requestNewPayment();
        break;
      }
      case PAYMENT_RESPONSE_STATUS.REQUIRES_ACTION: {
        this.stripeService.actionPayment(response.payment_secret_key);
        break;
      }
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.paymentSucceeded();
        break;
      }
      default: {
        this.requestNewPayment();
        break;
      }
    }
  }

  get isSavedCard(): boolean {
    return !!this.stripeCards?.find((card) => card.id === this.selectedCard.id);
  }

  public onChageSubscription(): void {
    this.unselectSubcription.emit();
  }

  private getAllCards(): void {
    this.stripeService.getCards(false).subscribe(
      (stripeCards: FinancialCard[]) => {
        this.stripeCards = stripeCards;
        this.selectedCard = this.stripeCards.find((card) => card.invoices_default) || this.stripeCards[0];
      },
      () => {
        this.errorService.i18nError(TRANSLATION_KEY.STRIPE_CARDS_RETRIEVAL_ERROR);
      }
    );
  }

  public onScrollToInvoice(): void {
    setTimeout(() => {
      this.scrollIntoViewService.scrollToSelector('#billing');
    });
  }

  public onSelectedTierChanged(tier: Tier): void {
    this.selectedTier = tier;
  }

  public onPurchaseButtonClick(): void {
    if (this.isInvoiceRequired) {
      this.eventService.emit(EventService.FORM_SUBMITTED);
    } else {
      this.purchaseSubscription();
    }
  }

  public purchaseSubscription(): void {
    this.isLoading = true;
    this.trackSubscriptionPayConfirmation();
    if (this.isSavedCard) {
      this.addSubscriptionFromSavedCard();
    } else {
      this.addSubscriptionFromNewCard();
    }
  }

  public onChangeSelectedCard(card: FinancialCard): void {
    this.selectedCard = card;
  }

  private addSubscriptionFromNewCard() {
    const cardId = this.selectedCard.id;
    this.stripeService.addNewCard(cardId).subscribe(
      () => {
        if (this.isRetryPayment) {
          this.retrySubscription(cardId);
        } else {
          this.addSubscriptionFromSavedCard();
        }
      },
      (error: HttpErrorResponse) => this.requestNewPayment(error)
    );
  }

  private addSubscriptionFromSavedCard(): void {
    if (this.isRetryPayment) {
      this.retrySubscription();
    } else {
      this.subscriptionsService
        .newSubscription(this.selectedTier.id, this.selectedCard.id, this.isInvoiceRequired)
        .pipe(
          filter((response) => response.status === PAYMENT_SUCCESSFUL_CODE),
          mergeMap(() => this.subscriptionsService.checkNewSubscriptionStatus())
        )
        .subscribe(
          (response: SubscriptionResponse) => {
            if (!response.payment_status) {
              return this.paymentSucceeded();
            }
            this.managePaymentStatus(response);
          },
          (error) => {
            this.requestNewPayment(error);
          }
        );
    }
  }

  private showError(errors: PaymentError[]): void {
    if (errors?.length && errors[0].error_code in STRIPE_ERROR) {
      this.paymentError = errors[0].error_code as STRIPE_ERROR;
      this.errorService.i18nError(
        TRANSLATION_KEY.PAYMENT_FAILED_ERROR,
        this.errorTextConfig[this.paymentError],
        TRANSLATION_KEY.PAYMENT_FAILED_ERROR_TITLE
      );
      return;
    }
    this.paymentError = STRIPE_ERROR.unknown;
    this.errorService.i18nError(TRANSLATION_KEY.PAYMENT_FAILED_UNKNOWN_ERROR, '', TRANSLATION_KEY.PAYMENT_FAILED_ERROR_TITLE);
  }

  private paymentSucceeded(): void {
    this.isLoading = false;
    this.isRetryPayment = false;
    this.openPaymentSuccessModal();
  }

  private retrySubscription(paymentMethodId = this.selectedCard.id): void {
    this.isLoading = true;
    this.subscriptionsService
      .retrySubscription(this._invoiceId, paymentMethodId)
      .pipe(
        filter((response) => response.status === PAYMENT_SUCCESSFUL_CODE),
        mergeMap(() => this.subscriptionsService.checkRetrySubscriptionStatus())
      )
      .subscribe(
        (response: SubscriptionResponse) => {
          this.managePaymentStatus(response);
        },
        (error) => {
          this.requestNewPayment(error);
        }
      );
  }

  private openPaymentSuccessModal(): void {
    let modalRef: NgbModalRef = this.modalService.open(PaymentSuccessModalComponent, { windowClass: 'success' });
    const modalComponent: PaymentSuccessModalComponent = modalRef.componentInstance;
    modalComponent.tier = this.selectedTier.id;
    modalComponent.isNewSubscriber = !this.user.featured;
    modalComponent.isNewCard = !this.isSavedCard;
    modalComponent.isInvoice = this.isInvoiceRequired;
    modalComponent.subscriptionCategoryId = this.subscription.category_id as SUBSCRIPTION_CATEGORIES;

    modalRef.result.then(
      () => this.purchaseSuccessful.emit(),
      () => this.purchaseSuccessful.emit()
    );
  }

  private requestNewPayment(error?: HttpErrorResponse): void {
    const errorResponse: PaymentError[] = error?.error;
    this.showError(errorResponse);
    this.isLoading = false;
  }

  @HostListener('click') onClick() {
    if (this.paymentError) {
      this.paymentError = null;
    }
  }

  private trackViewSubscriptionTier(): void {
    const event: AnalyticsPageView<ViewSubscriptionTier> = {
      name: ANALYTICS_EVENT_NAMES.ViewSubscriptionTier,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionTier,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackClickSubscriptionAddCard(): void {
    const event: AnalyticsEvent<ClickSubscriptionAddCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionAddCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionTier,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackSubscriptionPaymentButtonAvailable(): void {
    const event: AnalyticsEvent<SubscriptionPaymentButtonAvailable> = {
      name: ANALYTICS_EVENT_NAMES.SubscriptionPaymentButtonAvailable,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: this.selectedTier.id,
        invoiceNeeded: this.isInvoiceRequired,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private trackSubscriptionPayConfirmation(): void {
    const discountPercent = this.subscriptionsService.getTierDiscountPercentatge(this.selectedTier);
    const event: AnalyticsEvent<SubscriptionPayConfirmation> = {
      name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: this.selectedTier.id,
        screenId: SCREEN_IDS.ProfileSubscription,
        isNewCard: !this.isSavedCard,
        isNewSubscriber: !this.user.featured,
        discountPercent,
        invoiceNeeded: this.isInvoiceRequired,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
      },
    };
    this.analyticsService.trackEvent(event);
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(STRIPE_PAYMENT_RESPONSE_EVENT_KEY);
  }
}
