import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCardOption } from '../../../core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS } from 'app/core/payments/payment.service';
import { EventService } from 'app/core/event/event.service';

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

  constructor(public activeModal: NgbActiveModal,
              private eventService: EventService) {
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

  public setNewCard(event: any) {
    console.log('event ', event);
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
