import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCardOption, PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { EventService } from '../../../core/event/event.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { ErrorsService } from '../../../core/errors/errors.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsModel } from '../../../core/subscriptions/subscriptions.model';
import * as _ from 'lodash';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss']
})

export class AddNewSubscriptionModalComponent implements OnInit {

  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  public isLast: boolean;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public selectedTier: Tier;
  public isStripe: boolean;
  public loading = false;
  public isPaymentError = false;
  public currentSlide: string;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;
  public selectedPlanId: string;
  private invoiceId: string;
  private REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD';
  private REQUIRES_ACTION = 'REQUIRES_ACTION';
  private SUCCEEDED = 'SUCCEEDED';

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private eventService: EventService,
              private subscriptionsService: SubscriptionsService,
              private modalService: NgbModal,
              private errorService: ErrorsService) {
  }

  ngOnInit() {
    this.currentSlide = 'ngb-slide-0';
    this.selectedTier = this.subscription.selected_tier;
    this.selectedPlanId = this.subscription.selected_tier.id;
    
    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = val;
      if (this.isStripe) {
        this.eventService.subscribe('paymentActionResponse', (response) => {
          this.managePaymentResponse(response);
        });
      }
    });
  }

  public close() {
      this.activeModal.close();
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
          this.addSubscriptionFromSavedCard(this.selectedPlanId, paymentMethod.id);
        }
      }
    });
  }

  public addSubscriptionFromSavedCard(selectedPlanId: string = this.selectedPlanId, paymentMethodId = this.card.id) {
    this.loading = true;

    if (this.isRetryInvoice) {
      this.retrySubscription();
    } else {
      this.subscriptionsService.newSubscription(selectedPlanId, paymentMethodId).subscribe((response) => {
        if (response.status === 202) {
          this.subscriptionsService.checkNewSubscriptionStatus().subscribe((response: SubscriptionResponse) => {
            switch(response.payment_status.toUpperCase() ) {
              case this.REQUIRES_PAYMENT_METHOD: {
                this.isRetryInvoice = true;
                this.invoiceId = response.latest_invoice_id;
                this.requestNewPayment({error: { message: this.REQUIRES_PAYMENT_METHOD }});
                break;
              }
              case this.REQUIRES_ACTION: {
                this.stripeService.actionPayment(response.payment_secret_key);
                break;
              }
              case this.SUCCEEDED: {
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
            case this.REQUIRES_PAYMENT_METHOD: {
              this.isRetryInvoice = true;
              this.requestNewPayment({error: { message: this.REQUIRES_PAYMENT_METHOD }});
              break;
            }
            case this.REQUIRES_ACTION: {
              this.stripeService.actionPayment(response.payment_secret_key);
              break;
            }
            case this.SUCCEEDED: {
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

  public hasStripeCard(hasCard: boolean): void {
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

  public onSlide($event: NgbSlideEvent) {
    this.isLast = $event.current === 'ngb-slide-1';
    this.currentSlide = $event.current;
  }

  private managePaymentResponse(paymentResponse) {
    this.loading = false;
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case this.SUCCEEDED: {
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
    this.isRetryInvoice = false;
    this.close();
    let modalRef: NgbModalRef = this.modalService.open(PaymentSuccessModalComponent, {windowClass: 'success'});
    modalRef.result.then(() => {
      modalRef = null;
      this.eventService.emit('subscriptionChange');
    }, () => {});
  }

  @HostListener('click') onClick() {
    if (this.isPaymentError) {
      this.isPaymentError = false;
    }
  }


}
