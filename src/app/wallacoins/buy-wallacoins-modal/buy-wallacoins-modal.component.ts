import { Component, EventEmitter, OnInit } from '@angular/core';
import { Pack } from '../../core/payments/pack';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UUID } from 'angular2-uuid';
import { OrderProExtras, FinancialCardOption } from '../../core/payments/payment.interface';
import { Response } from '@angular/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../core/stripe/stripe.service';
import { EventService } from '../../core/event/event.service';

@Component({
  selector: 'tsl-buy-wallacoins-modal',
  templateUrl: './buy-wallacoins-modal.component.html',
  styleUrls: ['./buy-wallacoins-modal.component.scss']
})
export class BuyWallacoinsModalComponent implements OnInit {

  public pack: Pack;
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public mainLoading: boolean = true;
  public loading: boolean;
  public packIndex: number;
  public card: any;
  public isStripe: boolean;
  public isStripeCard = true;
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
    if (this.isStripe) {
      this.eventService.subscribe('paymentResponse', (response) => {
        this.managePaymentResponse(response);
      });
    }
  }

  get withCredits(): boolean {
    return this.pack.name === 'wallacredits';
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
    this.mainLoading = false;
  }

  public hasStripeCard(hasCard: boolean) {
    this.isStripeCard = hasCard;
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

    if (this.isStripe) {
      order.provider = 'STRIPE';
    }
    this.loading = true;
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
      if (this.isStripe) {
        this.stripeService.buy(order.id, paymentId, this.isStripeCard, this.savedCard, this.card);
      } else {
        this.buy(order.id);
      }
    }, (error: Response) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('packError');
      }
    });
  }

  private buy(orderId: string) {
    fbq('track', 'StartTrial');

    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      localStorage.setItem('transactionType', 'wallapack');
      localStorage.setItem('pack', JSON.stringify(this.pack));
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe((response: any) => {
        this.activeModal.close(response);
      }, () => {
        this.errorService.i18nError('packError');
        this.loading = false;
      });
    }
  }

  private managePaymentResponse(paymentResponse: string): void {
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

  public getTrackingAttributes(): Object {
    const payment_method = this.isStripe ? 'STRIPE' : 'SABADELL';
    return { payment_method };
  }
}
