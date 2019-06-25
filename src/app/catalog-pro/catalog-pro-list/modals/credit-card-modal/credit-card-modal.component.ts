import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard, FinancialCardOption } from '../../../../core/payments/payment.interface';
import { UUID } from 'angular2-uuid/index';
import { StripeService } from '../../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { EventService } from '../../../../core/event/event.service';

@Component({
  selector: 'tsl-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss']
})
export class CreditCardModalComponent implements OnInit {

  public financialCard: FinancialCard;
  public cardType = 'old';
  public total: number;
  public isStripeCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public card: any;
  public isStripe: boolean;
  public loading: boolean;

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private errorService: ErrorsService,
              private eventService: EventService) { }

  ngOnInit() {
    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = val;
      if (this.isStripe) {
        this.eventService.subscribe('paymentResponse', (response) => {
          this.managePaymentResponse(response);
        });
      }
    });
  }

  public checkout (orderId: string) {
    const paymentId: string = UUID.UUID();

    if (this.selectedCard || !this.savedCard) {
      this.stripeService.buy(orderId, paymentId, this.isStripeCard, this.savedCard, this.card);
    } else {
      this.loading = false;
      this.errorService.i18nError('noCardSelectedError');
    }
  }

  private managePaymentResponse(paymentResponse) {
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case 'SUCCEEDED': {
        this.activeModal.close('success');
        break;
      }
      default: {
        this.activeModal.close('error');
        break;
      }
    }
  }
  
  public setCardInfo(card: any) {
    this.card = card;
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

  public hasStripeCard(hasCard: boolean) {
    this.isStripeCard = hasCard;
  }

}
