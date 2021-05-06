import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { PaymentMethodResponse } from '@core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { PaymentError, STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionResponse, SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from '@private/features/profile/modal/payment-success/payment-success-modal.component';
import { FinancialCard } from '@shared/profile/credit-card-info/financial-card';

@Component({
  selector: 'tsl-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.scss'],
})
export class NewSubscriptionComponent implements OnInit {
  @Input() subscription: SubscriptionsResponse;
  @Input() user: User;
  @Output() purchaseSuccessful: EventEmitter<void> = new EventEmitter();
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
    private modalService: NgbModal
  ) {}
  public isLoading: boolean;

  public isRetryInvoice = false;
  private _invoiceId: string;

  ngOnInit(): void {
    this.getAllCards();
    this.selectedTier = this.subscription.tiers.find((tier) => tier.id === this.subscription.default_tier_id);
    this.benefits = this.subscriptionsService.getBenefits(this.subscription.category_id);
  }

  get isSavedCard(): boolean {
    return !!this.stripeCards.find((card) => card.id === this.selectedCard.id);
  }

  private getAllCards(): void {
    this.stripeService.getCards(false).subscribe(
      (stripeCards: FinancialCard[]) => {
        this.stripeCards = stripeCards;
        console.log('TEST', stripeCards);
        this.selectedCard = this.stripeCards.find((card) => card.invoices_default) || this.stripeCards[0];

        // this.subscriptionStripeCards = stripeCards.filter((card) => card.invoices_default);
      },
      () => {
        this.errorService.i18nError('getStripeCardsError');
      }
    );
  }

  public onInvoiceRequired(event: boolean) {
    this.isInvoiceRequired = event;
  }

  onSelectedTierChanged(tier: Tier) {
    this.selectedTier = tier;
  }

  onBillingInfoFormSaved() {}

  onPurchaseButtonClick() {
    this.isLoading;
    if (this.isSavedCard) {
      this.addSubscriptionFromSavedCard();
      return;
    }
    this.addSubscription();
  }

  onChangeSelectedCard(card: FinancialCard) {
    this.selectedCard = card;
  }

  private addSubscription() {
    const cardId = this.selectedCard.id;
    this.isLoading = true;
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
    this.isLoading = true;

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
                switch (response.payment_status.toUpperCase()) {
                  case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
                    this.isRetryInvoice = true;
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
              switch (response.status.toUpperCase()) {
                case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
                  this.isRetryInvoice = true;
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
