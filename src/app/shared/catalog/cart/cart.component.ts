import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Cart } from './cart';
import { CartChange, CartItem } from './cart-item.interface';
import { Order, PurchaseProductsWithCreditsResponse } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Response } from '@angular/http';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { CreditInfo, FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { BUMP_TYPES, CartBase } from './cart-base';
import { EventService } from '../../../core/event/event.service';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  @Input() provincialBump: boolean;
  @Input() creditInfo: CreditInfo;
  private active = true;
  public cart: CartBase;
  public types: string[] = BUMP_TYPES;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public loading: boolean;

  constructor(private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private trackingService: TrackingService,
    private paymentService: PaymentService,
    private eventService: EventService,
    private router: Router) {
      this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
        this.cart = cartChange.cart;
      });
  }

  ngOnInit() {
    this.cartService.createInstance(new Cart());
  }

  ngOnDestroy() {
    this.active = false;
    this.cartService.clean();
  }

  remove(cartItem: CartItem, type: string) {
    this.cartService.remove(cartItem.item.id, type);
  }

  clean() {
    this.cartService.clean();
  }

  checkout() {
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    this.loading = true;
    this.itemService.purchaseProductsWithCredits(order, orderId).subscribe((response: PurchaseProductsWithCreditsResponse) => {
      if (-this.usedCredits > 0) {
        localStorage.setItem('transactionType', 'bumpWithCredits');
        localStorage.setItem('transactionSpent', (-this.usedCredits).toString());
      } else {
        localStorage.setItem('transactionType', 'bump');
      }
      this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
      this.track(order);
      if (response.payment_needed) {
        this.buy(orderId);
      } else {
        this.success();
      }
    }, (error: Response) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

  private buy(orderId: string) {
    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe(() => {
        this.success();
      }, () => {
        this.router.navigate(['catalog/list', { code: -1 }]);
      });
    }
  }

  private success() {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;
    this.router.navigate(['catalog/list', { code: 200 }]);
  }

  private track(order: Order[]) {
    const result = order.map(purchase => ({ item_id: purchase.item_id, bump_type: purchase.product_id }));
    const itemsIds = Object.keys(order).map(key => order[key].item_id);
    this.trackingService.track(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, { selected_products: result });
    ga('send', 'event', 'Item', 'bump-cart');
    gtag('event', 'conversion', { 'send_to': 'AW-829909973/oGcOCL7803sQ1dfdiwM' });
    fbq('track', 'Purchase', {
          value: this.cart.total,
          currency: 'EUR',
          content_ids: itemsIds,
          content_type: 'product',
    });
    twq('track', 'Purchase', {
      value: this.cart.total,
      currency: 'EUR',
      num_items: order.length,
      content_ids: itemsIds,
      content_type: 'product',
      content_name: 'Bumps purchase'
    });
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
  }

  get totalToPay(): number {
    if (!this.cart) {
      return 0;
    }
    const totalCreditsToPay: number = this.cart.total * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return 0;
    } else {
      return this.cart.total - this.creditInfo.credit / this.creditInfo.factor;
    }
  }

  get usedCredits(): number {
    if (!this.cart) {
      return 0;
    }
    const totalCreditsToPay: number = this.cart.total * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return -totalCreditsToPay;
    } else {
      return -this.creditInfo.credit;
    }
  }

}