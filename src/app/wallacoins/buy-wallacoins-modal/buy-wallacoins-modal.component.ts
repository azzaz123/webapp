import { Component, EventEmitter, OnInit } from '@angular/core';
import { Pack } from '../../core/payments/pack';
import { PaymentService, PAYMENT_RESPONSE_STATUS, PAYMENT_METHOD } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UUID } from 'angular2-uuid';
import { OrderProExtras, FinancialCardOption } from '../../core/payments/payment.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../core/stripe/stripe.service';
import { EventService } from '../../core/event/event.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'tsl-buy-wallacoins-modal',
  templateUrl: './buy-wallacoins-modal.component.html',
  styleUrls: ['./buy-wallacoins-modal.component.scss']
})
export class BuyWallacoinsModalComponent implements OnInit {

  public pack: Pack;
  public mainLoading: boolean = true;
  public loading: boolean;
  public packIndex: number;
  public card: any;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;

  constructor(private errorService: ErrorsService,
              private paymentService: PaymentService,
              public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
  }

  get withCredits(): boolean {
    return this.pack.name === 'wallacredits';
  }

  public hasCard(hasCard: boolean) {
    this.mainLoading = false;
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  checkout() {
    const order: OrderProExtras = {
      id: UUID.UUID(),
      packs: [this.pack.id],
      origin: 'WEB',
    };
    const paymentId: string = UUID.UUID();

    order.provider = PAYMENT_METHOD.STRIPE;
    this.loading = true;
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
    this.stripeService.buy(order.id, paymentId, this.hasSavedCard, this.savedCard, this.card);
    }, (e: HttpErrorResponse) => {
      this.loading = false;
      if (e.error) {
        this.errorService.show(e);
      } else {
        this.errorService.i18nError('packError');
      }
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

  public getTrackingAttributes(): Object {
    const payment_method = PAYMENT_METHOD.STRIPE;
    return { payment_method };
  }
}
