import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCardOption } from '../../../core/payments/payment.interface';
import { EventService } from '../../../core/event/event.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';

@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss'],
  providers: [SubscriptionsService]
})

export class AddNewSubscriptionModalComponent implements OnInit {

  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public listingLimit: number;
  private isStripe: boolean;
  public loading = false;
  public paymentError = false;

  constructor(public activeModal: NgbActiveModal,
            private stripeService: StripeService,
            private eventService: EventService,
            private subscriptionsService: SubscriptionsService,
            private modalService: NgbModal) {
  }

  ngOnInit() {
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

  public addSubscription(paymentMethod) {
    this.loading = true;
    this.stripeService.addNewCard(paymentMethod.id).subscribe((response) => {
      if (!response) {
        this.requestNewPayment();
      } else {
        this.addSubscriptionFromSavedCard(paymentMethod.id);
      }
    });
  }

  public addSubscriptionFromSavedCard(paymentMethodId = this.card.id) {
    if (!this.loading) {
      this.loading = true;
    }
    this.subscriptionsService.newSubscription('plan_FSWGMZq6tDdiKc', paymentMethodId).subscribe((response) => {
      if (response.status === 202) {
        this.subscriptionsService.checkNewSubscriptionStatus().subscribe((response) => {
          switch(response.payment_status) {
            case 'requires_payment_method': {
              this.requestNewPayment();
              break;
            }
            case 'requires_action': {
              this.stripeService.actionPayment(response.payment_secret_key);
              break;
            }
            case 'succeeded': {
              this.paymentSucceeded();
              break;
            }
            default: {
              this.requestNewPayment();
              break;
            }
          }
        });
      }
    }, () => {
      console.warn('error on subscription');
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

  public setSavedCard(selectedCard: FinancialCardOption) {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }

  public selectListingLimit(event: any): void {
    this.listingLimit = parseInt(event.target.innerHTML, 10);
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
    this.loading = false;
    this.paymentError = true;
    this.action = 'clear';
  }

  private paymentSucceeded() {
    this.close();
    let modalRef: NgbModalRef = this.modalService.open(PaymentSuccessModalComponent, {windowClass: 'review'});
    modalRef.result.then(() => {
      modalRef = null;
    }, () => {});
  }

  @HostListener('click') onClick() {
    if (this.paymentError) {
      this.paymentError = false;
    }
  }


}
