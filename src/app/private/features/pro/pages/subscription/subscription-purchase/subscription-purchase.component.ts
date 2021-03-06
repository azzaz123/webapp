import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  ViewSuccessSubscriptionPayment,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { PaymentError, STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService, STRIPE_PAYMENT_RESPONSE_EVENT_KEY } from '@core/stripe/stripe.service';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SubscriptionResponse, SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryListingModalComponent } from '@private/features/pro/modal/category-listing-modal/category-listing-modal.component';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { COMPONENT_TYPE } from '@shared/profile-pro-billing/profile-pro-billing.component';
import { filter, mergeMap } from 'rxjs/operators';

export const PAYMENT_SUCCESSFUL_CODE = 202;

@Component({
  selector: 'tsl-subscription-purchase',
  templateUrl: './subscription-purchase.component.html',
  styleUrls: ['./subscription-purchase.component.scss'],
})
export class SubscriptionPurchaseComponent implements OnInit, OnDestroy {
  @Input() subscription: SubscriptionsResponse;
  @Input() user: User;
  @Input() editMode: boolean;
  @Output() purchaseSuccessful: EventEmitter<string | void> = new EventEmitter();
  @Output() unselectSubscription: EventEmitter<void> = new EventEmitter();

  public showPurchaseSuccessful: boolean;
  public stripeCards: FinancialCard[];
  public selectedCard: FinancialCard;
  public isInvoiceRequired = false;
  public selectedTier: Tier;
  public paymentError: STRIPE_ERROR;
  public benefits: string[];
  public isLoading: boolean;
  public isRetryPayment = false;
  public INVOICE_COMPONENT_TYPE = COMPONENT_TYPE;
  public basicTier: Tier;
  public availableTiers: Tier[];
  public helpPageUrl: string;
  private _invoiceId: string;
  private readonly errorTextConfig = {
    [STRIPE_ERROR.card_declined]: translations[TRANSLATION_KEY.CARD_NUMBER_INVALID],
    [STRIPE_ERROR.expired_card]: translations[TRANSLATION_KEY.CARD_DATE_INVALID],
    [STRIPE_ERROR.incorrect_cvc]: translations[TRANSLATION_KEY.CARD_CVC_INVALID],
  };
  private readonly helpUrlMapper: Record<CATEGORY_SUBSCRIPTIONS_IDS, CUSTOMER_HELP_PAGE> = {
    [CATEGORY_SUBSCRIPTIONS_IDS.CAR]: CUSTOMER_HELP_PAGE.CARS_SUBSCRIPTION,
    [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE]: CUSTOMER_HELP_PAGE.REAL_ESTATE_SUBSCRIPTION,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTOR_ACCESSORIES]: CUSTOMER_HELP_PAGE.CAR_PARTS_SUBSCRIPTION,
    [CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE]: CUSTOMER_HELP_PAGE.MOTORBIKE_SUBSCRIPTION,
    [CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS]: CUSTOMER_HELP_PAGE.EVERYTHING_ELSE_SUBSCRIPTION,
  };

  constructor(
    private stripeService: StripeService,
    private errorService: ErrorsService,
    private subscriptionsService: SubscriptionsService,
    private scrollIntoViewService: ScrollIntoViewService,
    private eventService: EventService,
    private analyticsService: AnalyticsService,
    private benefitsService: SubscriptionBenefitsService,
    private customerHelpService: CustomerHelpService,
    private modalService: NgbModal
  ) {}

  @HostListener('click') onClick() {
    if (this.paymentError) {
      this.paymentError = null;
    }
  }

  ngOnInit(): void {
    this.getAllCards();
    this.benefits = this.benefitsService.getBenefitsByCategory(this.subscription.category_id);
    this.mapTiers();
    this.subscribeStripeEvents();
    this.trackViewSubscriptionTier();
    this.helpPageUrl = this.customerHelpService.getPageUrl(this.helpUrlMapper[this.subscription.category_id]);
  }

  public onClearSubscription(): void {
    this.unselectSubscription.emit();
  }

  get isSavedCard(): boolean {
    return !!this.stripeCards?.find((card) => card.id === this.selectedCard.id);
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
        discount: !!this.selectedTier.discount,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public openCategoriesModal(): void {
    const modal = this.modalService.open(CategoryListingModalComponent, {
      windowClass: 'category-listing',
    });
    modal.componentInstance.subscription = this.subscription;
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(STRIPE_PAYMENT_RESPONSE_EVENT_KEY);
  }

  public onRedirectTo(path: string): void {
    this.purchaseSuccessful.emit(path);
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
    this.showPurchaseSuccessful = true;
    this.trackViewSuccessSubscriptionPayment();
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

  private requestNewPayment(error?: HttpErrorResponse): void {
    const errorResponse: PaymentError[] = error?.error;
    this.showError(errorResponse);
    this.isLoading = false;
  }

  private trackViewSubscriptionTier(): void {
    const event: AnalyticsPageView<ViewSubscriptionTier> = {
      name: ANALYTICS_EVENT_NAMES.ViewSubscriptionTier,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionTier,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        discount: !!this.selectedTier.discount,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  private trackSubscriptionPayConfirmation(): void {
    const event: AnalyticsEvent<SubscriptionPayConfirmation> = {
      name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
      eventType: ANALYTIC_EVENT_TYPES.Transaction,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: this.selectedTier.id,
        screenId: SCREEN_IDS.ProfileSubscription,
        isNewCard: !this.isSavedCard,
        isNewSubscriber: !this.user.featured,
        discountPercent: this.selectedTier.discount?.percentage | 0,
        invoiceNeeded: this.isInvoiceRequired,
        freeTrial: this.subscriptionsService.hasTrial(this.subscription),
        discount: !!this.selectedTier.discount,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private trackViewSuccessSubscriptionPayment(): void {
    const pageView: AnalyticsPageView<ViewSuccessSubscriptionPayment> = {
      name: ANALYTICS_EVENT_NAMES.ViewSuccessSubscriptionPayment,
      attributes: {
        tier: this.selectedTier.id,
        isNewSubscriber: !this.user.featured,
        isNewCard: !this.isSavedCard,
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        screenId: SCREEN_IDS.ProfileSubscription,
      },
    };
    this.analyticsService.trackPageView(pageView);
  }

  private mapTiers(): void {
    this.basicTier = this.subscription.tiers.find((tier) => tier.is_basic);

    if (this.basicTier) {
      this.selectedTier = this.basicTier;
      this.availableTiers = this.subscription.tiers.filter((tier) => !tier.is_basic);
    } else {
      this.selectedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.default_tier_id);
    }
  }
}
