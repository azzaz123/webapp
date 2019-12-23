import { Component, EventEmitter, OnInit } from '@angular/core';
import { OrderEvent } from '../../selected-items/selected-product.interface';
import { ItemService } from '../../../../core/item/item.service';
import { Item } from '../../../../core/item/item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { PurchaseProductsWithCreditsResponse } from '../../../../core/item/item-response.interface';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo, FinancialCardOption } from '../../../../core/payments/payment.interface';
import { Response } from '@angular/http';
import { StripeService } from '../../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../../core/errors/errors.service';

@Component({
  selector: 'tsl-buy-product-modal',
  templateUrl: './buy-product-modal.component.html',
  styleUrls: ['./buy-product-modal.component.scss']
})
export class BuyProductModalComponent implements OnInit {

  public type: string;
  public orderEvent: OrderEvent;
  public item: Item;
  public mainLoading: boolean = true;
  public loading: boolean;
  public creditInfo: CreditInfo;
  public card: any;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;

  constructor(private itemService: ItemService,
              public activeModal: NgbActiveModal,
              private paymentService: PaymentService,
              private eventService: EventService,
              private stripeService: StripeService,
              private errorService: ErrorsService) { }

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
    this.itemService.get(this.orderEvent.order[0].item_id).subscribe((item: Item) => {
      this.item = item;
      if (this.type === 'urgent') {
        this.item.urgent = true;
      }
    });

    this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
    });
  }

  get withCredits(): boolean {
    if (this.creditInfo) {
      return this.creditInfo.currencyName === 'wallacredits';
    }
  }

  get totalToPay(): number {
    const totalCreditsToPay: number = this.orderEvent.total * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return 0;
    } else {
      return this.orderEvent.total - this.creditInfo.credit / this.creditInfo.factor;
    }
  }

  get creditSpent(): number {
    return Math.min(this.creditInfo.credit, this.orderEvent.total * this.creditInfo.factor) * -1;
  }

  public hasCard(hasCard: boolean) {
    this.mainLoading = false;
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public checkout() {
    this.loading = true;
    const orderId: string = UUID.UUID();
    const creditsToPay = this.usedCredits(this.orderEvent.total);
    this.itemService.purchaseProductsWithCredits(this.orderEvent.order, orderId).subscribe((response: PurchaseProductsWithCreditsResponse) => {
      if (response.items_failed && response.items_failed.length) {
        this.activeModal.close('error');
      } else {
        localStorage.setItem('transactionSpent', (creditsToPay).toString());
        if (this.creditInfo.credit > 0) {
          if (this.type === 'urgent') {
            localStorage.setItem('transactionType', 'urgentWithCredits');
          } else if (this.type === 'reactivate') {
            localStorage.setItem('transactionType', 'reactivateWithCredits');
          } else if (this.type === 'listing-fee') {
            localStorage.setItem('transactionType', 'purchaseListingFeeWithCredits');
          }
        }
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
        if (response.payment_needed) {
          this.buyStripe(orderId);
        } else {
          this.activeModal.close('success');
        }
      }
    }, (error: Response) => {
      this.activeModal.close('error');
    });
  }

  private buyStripe(orderId: string) {
    const paymentId: string = UUID.UUID();

    if (this.selectedCard || !this.savedCard) {
      this.stripeService.buy(orderId, paymentId, this.hasSavedCard, this.savedCard, this.card);
    } else {
      this.loading = false;
      this.errorService.i18nError('noCardSelectedError');
    }
  }

  private managePaymentResponse(paymentResponse) {
    switch(paymentResponse) {
      case 'succeeded': {
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

  private usedCredits(orderTotal: number): number {
    const totalCreditsToPay: number = orderTotal * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return totalCreditsToPay;
    } else {
      return this.creditInfo.credit;
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

}
