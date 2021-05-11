import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { PaymentMethodResponse } from '@core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { PaymentError, STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService, STRIPE_PAYMENT_RESPONSE_EVENT_KEY } from '@core/stripe/stripe.service';
import { SubscriptionResponse, SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from '@private/features/profile/modal/payment-success/payment-success-modal.component';
import { COMPONENT_TYPE, ProfileProBillingComponent } from '@shared/profile-pro-billing/profile-pro-billing.component';
import { FinancialCard } from '@shared/profile/credit-card-info/financial-card';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss'],
})
export class NewSubscriptionComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  @Input() user: User;
  @Output() purchaseSuccessful: EventEmitter<void> = new EventEmitter();
  @Output() unselectSubcription: EventEmitter<void> = new EventEmitter();
  @ViewChild(ProfileProBillingComponent, { static: true }) profileProBillingComponent: ElementRef;

  public stripeCards: FinancialCard[];
  public selectedCard: FinancialCard;
  public isInvoiceRequired = false;
  public selectedTier: Tier;
  public paymentError: STRIPE_ERROR;
  public benefits: string[];
  constructor(
    private stripeService: StripeService,
    private errorService: ErrorsService,
    private subscriptionsService: SubscriptionsService,
    private modalService: NgbModal,
    private deviceService: DeviceDetectorService,
    private scrollIntoViewService: ScrollIntoViewService,
    private eventService: EventService
  ) {}
  public isLoading: boolean;

  public isRetryInvoice = false;
  private _invoiceId: string;

  public INVOICE_COMPONENT_TYPE = COMPONENT_TYPE;

  ngOnInit(): void {
    this.getAllCards();
    this.selectedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.default_tier_id);
    this.benefits = this.subscriptionsService.getBenefits(this.subscription.category_id);
    this.eventService.subscribe(STRIPE_PAYMENT_RESPONSE_EVENT_KEY, (response: any) => {
      this.managePaymentResponse(response);
    });
  }

  private managePaymentResponse(paymentResponse: any) {
    // TODO review this
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
        console.log('entra por es flujo extraño');
        this.isLoading = false;
        this.showError([paymentResponse]);
        break;
      }
    }
  }

  private managePaymentStatus(response: SubscriptionResponse) {
    const paymentStatus = response.payment_status.toUpperCase();
    switch (paymentStatus) {
      case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
        this.isRetryInvoice = true;
        this._invoiceId = response.latest_invoice_id;
        this.requestNewPayment();
        console.log('error');
        break;
      }
      case PAYMENT_RESPONSE_STATUS.REQUIRES_ACTION: {
        this.stripeService.actionPayment(response.payment_secret_key);
        console.log('require action');
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
    return !!this.stripeCards.find((card) => card.id === this.selectedCard.id);
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
        this.errorService.i18nError('getStripeCardsError');
      }
    );
  }

  onScrollToInvoice(): void {
    setTimeout(() => {
      this.scrollIntoViewService.scrollToSelector('#billing');
    });
  }

  onSelectedTierChanged(tier: Tier) {
    this.selectedTier = tier;
  }

  onBillingInfoFormSaved() {
    this.purchaseSubscription();
  }

  onPurchaseButtonClick() {
    if (this.isInvoiceRequired) {
      this.eventService.emit('formSubmited');
    } else {
      this.purchaseSubscription();
    }
  }

  private purchaseSubscription() {
    this.isLoading = true;
    if (this.isSavedCard) {
      this.addSubscriptionFromSavedCard();
    } else {
      this.addSubscriptionFromNewCard();
    }
  }

  onChangeSelectedCard(card: FinancialCard) {
    this.selectedCard = card;
  }

  private addSubscriptionFromNewCard() {
    const cardId = this.selectedCard.id;
    this.stripeService.addNewCard(cardId).subscribe(
      () => {
        if (this.isRetryInvoice) {
          this.retrySubscription(cardId);
        } else {
          this.addSubscriptionFromSavedCard();
        }
      },
      (error: HttpErrorResponse) => this.requestNewPayment(error)
    );
  }

  private addSubscriptionFromSavedCard() {
    if (this.isRetryInvoice) {
      this.retrySubscription();
    } else {
      this.subscriptionsService.newSubscription(this.selectedTier.id, this.selectedCard.id, this.isInvoiceRequired).subscribe(
        (response) => {
          if (response.status === 202) {
            this.subscriptionsService.checkNewSubscriptionStatus().subscribe(
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
      this.errorService.i18nError('paymentFailed', '', 'paymentFailedToastTitle');
      return;
    }
    this.paymentError = STRIPE_ERROR.unknown;
    this.errorService.i18nError('paymentFailedUnknown', '', 'paymentFailedToastTitle');
  }

  private paymentSucceeded() {
    this.isLoading = false;
    this.isRetryInvoice = false;
    this.openPaymentSuccessModal();
  }

  private retrySubscription(paymentMethodId = this.selectedCard.id) {
    this.isLoading = true;

    this.subscriptionsService.retrySubscription(this._invoiceId, paymentMethodId).subscribe(
      (response) => {
        if (response.status === 202) {
          this.subscriptionsService.checkRetrySubscriptionStatus().subscribe(
            (response) => {
              this.managePaymentStatus(response);
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

  private openPaymentSuccessModal() {
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
}
