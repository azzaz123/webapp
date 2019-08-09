import { Component } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { ErrorsService } from '../../core/errors/errors.service';
import { HttpService } from '../../core/http/http.service';
import { StripeService } from '../../core/stripe/stripe.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequestNewPaymentModalComponent } from './modals/request-new-payment-modal.component';
import { FinancialCardOption, PaymentMethodResponse } from '../../core/payments/payment.interface';

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent {

    public card: any;
    protected API_URL = 'api/v3/payments';
    private uuid: string;
    public action: string;
    public showCard = false;
    public savedCard = true;
    public selectedCard = false;

    constructor(private http: HttpService,
                private stripeService: StripeService,
                private errorService: ErrorsService,
                private modalService: NgbModal) {
    }

    addSubscription(paymentMethod) {
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

    addSubscriptionFromSavedCard() {
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

    public hasStripeCard(hasCard: boolean) {
        if (!hasCard) {
            this.addNewCard();
        }
    }

    public addNewCard() {
        this.showCard = true;
        this.savedCard = false;
    }

    public removeNewCard() {
        this.showCard = false;
        this.savedCard = true;
    }

    public setSavedCard(selectedCard: FinancialCardOption) {
        this.showCard = false;
        this.savedCard = true;
        this.selectedCard = true;
        this.setCardInfo(selectedCard);
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
