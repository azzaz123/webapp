import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCardOption, PaymentMethodResponse, FinancialCard } from '../../../core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS } from 'app/core/payments/payment.service';
import { EventService } from 'app/core/event/event.service';
import { StripeService } from 'app/core/stripe/stripe.service';

@Component({
  selector: 'tsl-change-card-modal',
  templateUrl: './change-card-modal.component.html',
  styleUrls: ['./change-card-modal.component.scss']
})
export class ChangeCardModalComponent implements OnInit  {

  public mainLoading: boolean = true;
  public loading: boolean;
  public card: any;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public newLoading = false;

  constructor(public activeModal: NgbActiveModal,
              private eventService: EventService,
              private stripeService: StripeService) {
  }

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
  }

  public hasCard(hasCard: boolean) {
    this.mainLoading = false;
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
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

  public setDefaultCard(paymentMethod?: PaymentMethodResponse) {
    console.log('setDefaultCard event ', paymentMethod, this.card);
    let financialCard: FinancialCard
    if (paymentMethod) {
        financialCard = this.stripeService.mapResponse(paymentMethod);
    } else {
        financialCard = this.card;
    }
    this.activeModal.close(financialCard);
      
  }

  public setExistingDefaultCard() {
    console.log('setExistingDefaultCard event ', this.card);
    let financialCard = this.card
    this.newLoading = true;
    this.stripeService.getSetupIntent().subscribe((clientSecret: string) => {
      this.stripeService.createDefaultCard(clientSecret, this.card).then((paymentMethod: PaymentMethodResponse) => {
        if (paymentMethod) {
          financialCard = this.stripeService.mapResponse(paymentMethod);
          this.activeModal.close(financialCard);
        } else {
          this.newLoading = false;
        }
      }).catch(() => this.newLoading = false);
    });
      
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.activeModal.close('success');
        break;
      }
      default: {
        this.activeModal.close('error');
        break;
      }
    }
  }
  
}
