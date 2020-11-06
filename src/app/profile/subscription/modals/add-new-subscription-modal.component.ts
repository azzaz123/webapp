import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import {
  StripeService,
  STRIPE_PAYMENT_RESPONSE_EVENT_KEY,
} from '../../../core/stripe/stripe.service';
import {
  FinancialCardOption,
  PaymentMethodResponse,
} from '../../../core/payments/payment.interface';
import { EventService } from '../../../core/event/event.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { ErrorsService } from '../../../core/errors/errors.service';
import {
  SubscriptionResponse,
  SubscriptionsResponse,
  Tier,
  SUBSCRIPTION_CATEGORIES,
} from '../../../core/subscriptions/subscriptions.interface';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickSubscriptionContinuePayment,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  SubscriptionPayConfirmation,
  ClickSubscriptionDirectContact,
} from '../../../core/analytics/analytics-constants';
import {
  PAYMENT_RESPONSE_STATUS,
  PaymentService,
} from '../../../core/payments/payment.service';
import { CATEGORY_IDS } from '../../../core/category/category-ids';
import {
  CAR_DEALER_TYPEFORM_URL,
  TERMS_AND_CONDITIONS_URL,
  PRIVACY_POLICY_URL,
} from '../../../core/constants';
import { IOption } from 'app/dropdown/utils/option.interface';
import { I18nService } from 'app/core/i18n/i18n.service';

@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss'],
})
export class AddNewSubscriptionModalComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public selectedTier: Tier;
  public loading = false;
  public isPaymentError = false;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;
  public isNewSubscriber = false;
  public loaded: boolean;
  public hasSavedCard = true;
  public carsCategoryId = CATEGORY_IDS.CAR;
  public carDealerTypeformLink = CAR_DEALER_TYPEFORM_URL;
  public termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public privacyPolicyURL = PRIVACY_POLICY_URL;
  public invoiceOptions: IOption[] = [];
  public isBillingInfoValid: boolean;
  private _invoiceId: string;
  private _selectedInvoiceOption: string;
  private _submitBillingInfoForm = false;
  private _isBillingInfoMissing: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private stripeService: StripeService,
    private eventService: EventService,
    private subscriptionsService: SubscriptionsService,
    private modalService: NgbModal,
    private errorService: ErrorsService,
    private analyticsService: AnalyticsService,
    private paymentService: PaymentService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.generateInvoiceOptions();
    this.loaded = true;
    this.selectedTier = this.subscription.selected_tier;
    this.eventService.subscribe(
      STRIPE_PAYMENT_RESPONSE_EVENT_KEY,
      (response) => {
        this.managePaymentResponse(response);
      }
    );
    this.getBillingInfo();
    this._selectedInvoiceOption = this.invoiceOptions[1].value.toString();
  }

  ngAfterViewInit() {
    this.carousel.keyboard = false;
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(STRIPE_PAYMENT_RESPONSE_EVENT_KEY);
  }

  private generateInvoiceOptions() {
    this.invoiceOptions = [
      { value: 'true', label: this.i18nService.getTranslations('yes') },
      { value: 'false', label: this.i18nService.getTranslations('no') },
    ];
  }

  public close() {
    this.activeModal.close('add');
  }

  public addSubscription(paymentMethod: PaymentMethodResponse) {
    this.loading = true;
    this.stripeService.addNewCard(paymentMethod.id).subscribe(
      () => {
        if (this.isRetryInvoice) {
          this.retrySubscription(paymentMethod.id);
        } else {
          this.addSubscriptionFromSavedCard(
            this.selectedTier.id,
            paymentMethod.id
          );
        }
      },
      () => this.requestNewPayment()
    );
  }

  public addSubscriptionFromSavedCard(
    selectedPlanId: string = this.selectedTier.id,
    paymentMethodId = this.card.id
  ) {
    this.loading = true;

    if (this.isRetryInvoice) {
      this.retrySubscription();
    } else {
      this.subscriptionsService
        .newSubscription(
          selectedPlanId,
          paymentMethodId,
          JSON.parse(this.selectedInvoiceOption)
        )
        .subscribe(
          (response) => {
            if (response.status === 202) {
              this.subscriptionsService.checkNewSubscriptionStatus().subscribe(
                (response: SubscriptionResponse) => {
                  if (!response.payment_status) {
                    return this.paymentSucceeded();
                  }
                  switch (response.payment_status.toUpperCase()) {
                    case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
                      this.isRetryInvoice = true;
                      this._invoiceId = response.latest_invoice_id;
                      this.requestNewPayment({
                        error: {
                          message:
                            PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD,
                        },
                      });
                      break;
                    }
                    case PAYMENT_RESPONSE_STATUS.REQUIRES_ACTION: {
                      this.stripeService.actionPayment(
                        response.payment_secret_key
                      );
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
                },
                (error) => {
                  this.requestNewPayment(error);
                }
              );
            }
          },
          (error) => {
            this.requestNewPayment(error);
          }
        );
    }
  }

  private retrySubscription(paymentMethodId = this.card.id) {
    if (!this.loading) {
      this.loading = true;
    }
    this.subscriptionsService
      .retrySubscription(this._invoiceId, paymentMethodId)
      .subscribe(
        (response) => {
          if (response.status === 202) {
            this.subscriptionsService.checkRetrySubscriptionStatus().subscribe(
              (response) => {
                switch (response.status.toUpperCase()) {
                  case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
                    this.isRetryInvoice = true;
                    this.requestNewPayment({
                      error: {
                        message:
                          PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD,
                      },
                    });
                    break;
                  }
                  case PAYMENT_RESPONSE_STATUS.REQUIRES_ACTION: {
                    this.stripeService.actionPayment(
                      response.payment_secret_key
                    );
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
              },
              (error) => {
                this.requestNewPayment(error);
              }
            );
          }
        },
        (error) => {
          this.requestNewPayment(error);
        }
      );
  }

  public setCardInfo(card: any): void {
    this.card = card;
  }

  public hasCard(hasCard: boolean): void {
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public addNewCard(): void {
    this.showCard = true;
    this.savedCard = false;
  }

  public removeNewCard(): void {
    this.showCard = false;
    this.savedCard = true;
  }

  public setSavedCard(selectedCard: FinancialCardOption): void {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

  private managePaymentResponse(paymentResponse) {
    this.loading = false;
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
        console.warn('error on action payment');
        break;
      }
    }
  }

  private requestNewPayment(error?: any) {
    this.errorService.i18nError('paymentFailed');
    this.loading = false;
    this.isPaymentError = true;
    this.action = 'clear';
  }

  private paymentSucceeded() {
    this.loading = false;
    this.isRetryInvoice = false;
    this.openPaymentSuccessModal();
  }

  private openPaymentSuccessModal() {
    let modalRef: NgbModalRef = this.modalService.open(
      PaymentSuccessModalComponent,
      { windowClass: 'success' }
    );
    const modalComponent: PaymentSuccessModalComponent =
      modalRef.componentInstance;
    modalComponent.tier = this.selectedTier.id;
    modalComponent.isNewSubscriber = this.isNewSubscriber;
    modalComponent.isNewCard = !this.hasSavedCard;
    modalComponent.isInvoice = this.selectedInvoiceOption;
    modalComponent.subscriptionCategoryId = this.subscription
      .category_id as SUBSCRIPTION_CATEGORIES;

    modalRef.result.then(
      () => {
        modalRef = null;
        this.close();
      },
      () => {
        this.close();
      }
    );
  }

  @HostListener('click') onClick() {
    if (this.isPaymentError) {
      this.isPaymentError = false;
    }
  }

  public trackClickContinueToPayment() {
    const event: AnalyticsEvent<ClickSubscriptionContinuePayment> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionContinuePayment,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        isNewSubscriber: this.isNewSubscriber,
        screenId: SCREEN_IDS.ProfileSubscription,
        tier: this.selectedTier.id,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackClickPay(isNewCard: boolean) {
    const discountPercent = this.subscriptionsService.getTierDiscountPercentatge(
      this.selectedTier
    );
    const event: AnalyticsEvent<SubscriptionPayConfirmation> = {
      name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: this.subscription.category_id as SUBSCRIPTION_CATEGORIES,
        tier: this.selectedTier.id,
        screenId: SCREEN_IDS.ProfileSubscription,
        isNewCard,
        isNewSubscriber: this.isNewSubscriber,
        discountPercent,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  // TODO: This must be refactored
  public reloadPage() {
    window.location.reload();
  }

  public isDiscountedTier(tier: Tier): boolean {
    return this.subscriptionsService.isDiscountedTier(tier);
  }

  public isFreeTier(tier: Tier): boolean {
    return this.subscriptionsService.isFreeTier(tier);
  }

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public trackClickCardealerTypeform() {
    const event: AnalyticsEvent<ClickSubscriptionDirectContact> = {
      name: ANALYTICS_EVENT_NAMES.ClickSubscriptionDirectContact,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        subscription: CATEGORY_IDS.CAR as 100,
        screenId: SCREEN_IDS.Subscription,
        isNewSubscriber: this.isNewSubscriber,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public onInvoiceOptionSelect(event: any) {
    this._selectedInvoiceOption = event.value;
  }

  public onBillingInfoFormSaved(): void {
    this.loading = false;
    this.carousel.select('step-3');
  }

  public getBillingInfo(): void {
    this.paymentService.getBillingInfo(false).subscribe(
      () => {
        this._isBillingInfoMissing = false;
      },
      () => {
        this._isBillingInfoMissing = true;
      }
    );
  }

  public continueToPayment() {
    this.loading = true;
    this._submitBillingInfoForm = true;
    this.eventService.emit('formSubmited');
  }

  public continueToInvoice() {
    this.loading = false;
    this.carousel.select('step-2b');
  }

  get submitBillingInfoForm(): boolean {
    return this._submitBillingInfoForm;
  }

  get selectedInvoiceOption(): string {
    return this._selectedInvoiceOption;
  }

  get isBillingInfoMissing(): boolean {
    return this._isBillingInfoMissing;
  }

  get canContinueToPayment(): boolean {
    return this.selectedInvoiceOption === 'false' || !this.isBillingInfoMissing;
  }

  get canContinueToInvoice(): boolean {
    return this.selectedInvoiceOption === 'true' && this.isBillingInfoMissing;
  }

  get canEditInvoice(): boolean {
    return !this.isBillingInfoMissing && this.selectedInvoiceOption === 'true';
  }
}
