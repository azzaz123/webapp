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
import { Subscription } from '../../../core/subscriptions/subscriptions.interface';


@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss'],
  providers: [SubscriptionsService]
})

export class AddNewSubscriptionModalComponent implements OnInit {

  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  public isLast: boolean;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public listingLimit: number;
  public isStripe: boolean;
  public loading = false;
  public isPaymentError = false;
  public currentSlide: string;
  public isRetryInvoice = false;
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
    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = true;//val;
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
          this.addSubscriptionFromSavedCard(paymentMethod.id);
        }
      }
    });
  }

  public addSubscriptionFromSavedCard(paymentMethodId = this.card.id) {
    if (!this.loading) {
      this.loading = true;
    }
    if (this.isRetryInvoice) {
      this.retrySubscription();
    } else {
      console.log('AddSubscriptionFromSavedCard ', paymentMethodId)
      this.subscriptionsService.newSubscription('plan_FSWGMZq6tDdiKc', paymentMethodId).subscribe((response) => {
        console.log('ADD SUBS FROM SAVED newSubscription ', response);
        if (response.status === 202) {
          this.subscriptionsService.checkNewSubscriptionStatus().subscribe((response: Subscription) => {
            console.log('CHECK NEW SUBS STATUS ', response);
            switch(response.payment_status.toUpperCase() ) {
              case this.REQUIRES_PAYMENT_METHOD: {
                this.isRetryInvoice = true;
                this.invoiceId = response.latest_invoice_id;
                this.requestNewPayment();
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
          }, () => {
            this.requestNewPayment();
          });
        }
      }, () => {
        this.requestNewPayment();
      });
    }
  }

  private retrySubscription(paymentMethodId = this.card.id) {
    if (!this.loading) {
      this.loading = true;
    }
    console.log('retry');
    this.subscriptionsService.retrySubscription(this.invoiceId, paymentMethodId).subscribe((response) => {
      console.log('retry subscription private ', response);
      if (response.status === 202) {
        this.subscriptionsService.checkRetrySubscriptionStatus().subscribe((response) => {
          console.log('checkRetrySubscriptionStatus ', response);
          switch(response.status.toUpperCase() ) {
            case this.REQUIRES_PAYMENT_METHOD: {
              this.isRetryInvoice = true;
              this.requestNewPayment();
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
        }, () => {
          this.requestNewPayment();
        });
      }
    }, () => {
      this.requestNewPayment();
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

  public selectListingLimit(event: any): void {
    this.listingLimit = parseInt(event.target.innerHTML, 10);
  }

  public onSlide($event: NgbSlideEvent) {
    this.isLast = $event.current === 'ngb-slide-1';
    this.currentSlide = $event.current;
  }

  private managePaymentResponse(paymentResponse) {
    this.loading = false;
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case 'SUCCEEDED': {
        this.paymentSucceeded();
        break;
      }
      default: {
        console.log('error on action payment');
        break;
      }
    }
  }

  private requestNewPayment() {
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
    }, () => {});
  }

  @HostListener('click') onClick() {
    if (this.isPaymentError) {
      this.isPaymentError = false;
    }
  }


}
