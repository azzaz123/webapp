import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCardOption, PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { EventService } from '../../../core/event/event.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { ErrorsService } from '../../../core/errors/errors.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsEvent,
  ClickContinuePaymentSubscription,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  ClickPaySubscription
} from '../../../core/analytics/analytics-constants';
import { PAYMENT_RESPONSE_STATUS } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss']
})

export class AddNewSubscriptionModalComponent implements OnInit {

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
  private invoiceId: string;
  public loaded: boolean;
  public hasSavedCard = true;

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private eventService: EventService,
              private subscriptionsService: SubscriptionsService,
              private modalService: NgbModal,
              private errorService: ErrorsService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.loaded = true;
    this.selectedTier = this.subscription.selected_tier;
    this.eventService.subscribe('paymentActionResponse', (response) => {
      this.managePaymentResponse(response);
    });
      
   
  }

  public close() {
      this.activeModal.close('add');
  }

  public addSubscription(paymentMethod: PaymentMethodResponse) {
    this.loading = true;
    this.stripeService.addNewCard(paymentMethod.id).subscribe((response) => {
      if (!response) {
        this.requestNewPayment();
      } else {
        if (this.isRetryInvoice) {
          this.retrySubscription(paymentMethod.id);
        } else {
          this.addSubscriptionFromSavedCard(this.selectedTier.id, paymentMethod.id);
        }
      }
    });
  }

  public addSubscriptionFromSavedCard(selectedPlanId: string = this.selectedTier.id, paymentMethodId = this.card.id) {
    this.loading = true;

    if (this.isRetryInvoice) {
      this.retrySubscription();
    } else {
      this.subscriptionsService.newSubscription(selectedPlanId, paymentMethodId).subscribe((response) => {
        if (response.status === 202) {
          this.subscriptionsService.checkNewSubscriptionStatus().subscribe((response: SubscriptionResponse) => {
            switch(response.payment_status.toUpperCase() ) {
              case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
                this.isRetryInvoice = true;
                this.invoiceId = response.latest_invoice_id;
                this.requestNewPayment({error: { message: PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD }});
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
          }, (error) => {
            this.requestNewPayment(error);
          });
        }
      }, (error) => {
        this.requestNewPayment(error);
      });
    }
  }

  private retrySubscription(paymentMethodId = this.card.id) {
    if (!this.loading) {
      this.loading = true;
    }
    this.subscriptionsService.retrySubscription(this.invoiceId, paymentMethodId).subscribe((response) => {
      if (response.status === 202) {
        this.subscriptionsService.checkRetrySubscriptionStatus().subscribe((response) => {
          switch(response.status.toUpperCase() ) {
            case PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD: {
              this.isRetryInvoice = true;
              this.requestNewPayment({error: { message: PAYMENT_RESPONSE_STATUS.REQUIRES_PAYMENT_METHOD }});
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
        }, (error) => {
          this.requestNewPayment(error);
        });
      }
    }, (error) => {
      this.requestNewPayment(error);
    });
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
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.paymentSucceeded();
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
    this.close();
    let modalRef: NgbModalRef = this.modalService.open(PaymentSuccessModalComponent, { windowClass: 'success' });
    modalRef.result.then(() => {
      modalRef = null;
    }, () => {});
  }

  @HostListener('click') onClick() {
    if (this.isPaymentError) {
      this.isPaymentError = false;
    }
  }

  public onClickContinueToPayment() {
    const event: AnalyticsEvent<ClickContinuePaymentSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickContinuePaymentSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription,
        tier: this.selectedTier.id
      }
    };

    this.analyticsService.trackEvent(event);
  }

  public onClickPay(isNewVisa: boolean) {
    const event: AnalyticsEvent<ClickPaySubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickPaysubscription,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.ProfileSubscription,
        isNewVisa
      }
    };

    this.analyticsService.trackEvent(event);
  }

}