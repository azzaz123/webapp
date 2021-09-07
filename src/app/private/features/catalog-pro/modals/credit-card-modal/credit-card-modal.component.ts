import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard, FinancialCardOption } from '@core/payments/payment.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { UuidService } from '@core/uuid/uuid.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss'],
})
export class CreditCardModalComponent implements OnInit {
  public financialCard: FinancialCard;
  public orderId: string;
  public cardType = 'old';
  public total: number;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public card: any;
  public loading: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private stripeService: StripeService,
    private errorService: ErrorsService,
    private uuidService: UuidService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
  }

  public checkout(orderId: string) {
    const paymentId: string = this.uuidService.getUUID();

    if (this.selectedCard || !this.savedCard) {
      this.stripeService.buy(orderId, paymentId, this.hasSavedCard, this.savedCard, this.card);
    } else {
      this.loading = false;
      this.errorService.i18nError(TRANSLATION_KEY.NO_CARD_SELECTED_ERROR);
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

  public hasCard(hasCard: boolean) {
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  private managePaymentResponse(paymentResponse) {
    switch (paymentResponse && paymentResponse.toUpperCase()) {
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
