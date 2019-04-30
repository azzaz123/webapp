import { Component, EventEmitter, OnInit } from '@angular/core';
import { OrderEvent } from '../../selected-items/selected-product.interface';
import { ItemService } from '../../../../core/item/item.service';
import { Item } from '../../../../core/item/item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { PurchaseProductsWithCreditsResponse } from '../../../../core/item/item-response.interface';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { Response } from '@angular/http';

@Component({
  selector: 'tsl-buy-product-modal',
  templateUrl: './buy-product-modal.component.html',
  styleUrls: ['./buy-product-modal.component.scss']
})
export class BuyProductModalComponent implements OnInit {

  public type: string;
  public orderEvent: OrderEvent;
  public item: Item;
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public mainLoading: boolean = true;
  public loading: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public creditInfo: CreditInfo;

  constructor(private itemService: ItemService,
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private eventService: EventService) { }

  ngOnInit() {
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
    this.hasFinancialCard = hasCard;
    this.mainLoading = false;
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
          this.buy(orderId);
        } else {
          this.activeModal.close('success');
        }
      }
    }, (error: Response) => {
      this.activeModal.close('error');
    });
  }

  private buy(orderId: string) {
    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      localStorage.setItem('redirectToTPV', 'true');
      this.paymentService.paymentIntent(orderId).subscribe((response: any) => {
        this.payment(response.token);
      });
    } else {
      this.paymentService.paymentIntent(orderId).subscribe((response: any) => {
        this.payment(response.token);
        this.activeModal.close('success');
      }, () => {
        this.activeModal.close('error');
      });
    }
  }

  private usedCredits(orderTotal: number): number {
    const totalCreditsToPay: number = orderTotal * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return totalCreditsToPay;
    } else {
      return this.creditInfo.credit;
    }
  }

}
