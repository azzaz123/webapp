import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestNewPaymentModalComponent } from './request-new-payment-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/http/http.service';
import { FinancialCardOption } from '../../../core/payments/payment.interface';


@Component({
  selector: 'tsl-add-new-subscription-modal',
  templateUrl: './add-new-subscription-modal.component.html',
  styleUrls: ['./add-new-subscription-modal.component.scss']
})

export class AddNewSubscriptionModalComponent {

  public card: any;
  protected API_URL = 'api/v3/payments';
  private uuid: string;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public listingLimit: number;

  constructor(public activeModal: NgbActiveModal,
            private http: HttpService,
            private stripeService: StripeService,
            private modalService: NgbModal) {
  }

  public close() {
      this.activeModal.close();
  }

  public addSubscription(paymentMethod) {
    this.stripeService.addNewCard(paymentMethod.id).subscribe(() => {
      this.newSubscription('plan_FSWGMZq6tDdiKc', paymentMethod.id).subscribe((response) => {
          if (response.status === 202) {
              this.checkNewSubscriptionStatus().subscribe((response) => {
                  if (response.status === 'incomplete') {
                      this.requestNewPayment();
                  }
                  if (response.status === 'requires_action') {
                      console.log('prompt 3D secure');
                      this.stripeService.requiresActionPayment(response.paymentIntentSecret).then((response: any) => {
                          this.managePaymentResponse(response);
                      });
                  }
              });
          }
      }, () => {
          console.warn('error on subscription');
      });
    });
  }

  public addSubscriptionFromSavedCard() {
    this.newSubscription('plan_FSWGMZq6tDdiKc', this.card.id).subscribe((response) => {
      if (response.status === 202) {
          this.checkNewSubscriptionStatus().subscribe((response) => {
              if (response.status === 'incomplete') {
                  this.requestNewPayment();
              }
              if (response.status === 'requires_action') {
                  console.log('prompt 3D secure');
                  this.stripeService.requiresActionPayment(response.paymentIntentSecret).then((response: any) => {
                      this.managePaymentResponse(response);
                  });
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

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${this.API_URL}/c2b/stripe/subscription/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
    });
  }

  public checkNewSubscriptionStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/c2b/stripe/subscription/${this.uuid}`)
    .map(res => res.json())
    .retryWhen(errors => 
        errors.delay(1000).take(5)
        );
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
    this.listingLimit = event.target.innerHTML;
  }

  private managePaymentResponse(paymentResponse) {
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case 'SUCCEEDED': {
        console.log('success action payment');
        break;
      }
      default: {
        console.log('error on action payment');
        break;
      }
    }
  }

  private requestNewPayment() {
    let modalRef: NgbModalRef = this.modalService.open(RequestNewPaymentModalComponent, {windowClass: 'review'});
    modalRef.result.then((response) => {
        console.log('new payment modal response ', response);
        this.action = 'clear';
        modalRef = null;
    }, () => {});
}

}
