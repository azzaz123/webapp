import { Component, EventEmitter, OnInit } from '@angular/core';
import { OrderEvent } from '../../selected-items/selected-product.interface';
import { ItemService } from '../../../../core/item/item.service';
import { Item } from '../../../../core/item/item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { PurchaseProductsWithCreditsResponse } from '../../../../core/item/item-response.interface';
import { ErrorsService } from '../../../../core/errors/errors.service';
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
              private eventService: EventService,
              private errorService: ErrorsService) { }

  ngOnInit() {
    this.itemService.get(this.orderEvent.order[0].item_id).subscribe((item: Item) => {
      this.item = item;
      this.item.urgent = true;
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

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
    this.mainLoading = false;
  }

  public checkout() {
    this.loading = true;
    const orderId: string = UUID.UUID();
    this.itemService.purchaseProductsWithCredits(this.orderEvent.order, orderId).subscribe((response: PurchaseProductsWithCreditsResponse) => {
      if (response.items_failed && response.items_failed.length) {
        this.errorService.i18nError('bumpError');
        this.activeModal.close('error');
      } else {
        localStorage.setItem('transactionSpent', (this.orderEvent.total * this.creditInfo.factor).toString());
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
        if (response.payment_needed) {
          this.buy(orderId);
        } else {
          this.activeModal.close('success');
        }
      }
    }, (error: Response) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
      this.activeModal.close('error');
    });
  }

  private buy(orderId: string) {
    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe(() => {
        this.activeModal.close('success');
      }, () => {
        this.activeModal.close('error');
      });
    }
  }

}
