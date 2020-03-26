
import {takeWhile} from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Cart } from './cart';
import { CartChange, CartItem } from './cart-item.interface';
import { Order, PurchaseProductsWithCreditsResponse } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { CreditInfo, FinancialCardOption } from '../../../core/payments/payment.interface';
import { PAYMENT_METHOD, PAYMENT_RESPONSE_STATUS } from '../../../core/payments/payment.service';
import { BUMP_TYPES, CartBase } from './cart-base';
import { EventService } from '../../../core/event/event.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { UUID } from 'angular2-uuid/index';
import { HttpErrorResponse } from '@angular/common/http';

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
  public hasSavedCard = true;
  public cardType = 'old';
  public loading: boolean;
  public card: any;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;

  constructor(private cartService: CartService,
              private itemService: ItemService,
              private errorService: ErrorsService,
              private trackingService: TrackingService,
              private eventService: EventService,
              private router: Router,
              private stripeService: StripeService) {
      this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
        this.cart = cartChange.cart;
      });
  }

  ngOnInit() {
    this.cartService.createInstance(new Cart());
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
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
    if (!this.cart.total || this.loading) {
      return;
    }
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    this.loading = true;
    this.track(order);
    setTimeout(() => {
      this.itemService.purchaseProductsWithCredits(order, orderId).subscribe((response: PurchaseProductsWithCreditsResponse) => {
        if (-this.usedCredits > 0) {
          localStorage.setItem('transactionType', 'bumpWithCredits');
          localStorage.setItem('transactionSpent', (-this.usedCredits).toString());
        } else {
          localStorage.setItem('transactionType', 'bump');
        }
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
        if (response.payment_needed) {
          this.buyStripe(orderId);
        } else {
          this.success();
        }
      }, (e: HttpErrorResponse) => {
        this.loading = false;
        if (e.error) {
          this.errorService.show(e);
        } else {
          this.errorService.i18nError('bumpError');
        }
      });
    }, 2000);
  }

  public setCardInfo(card: any): void {
    this.card = card;
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.success();
        break;
      }
      default: {
        this.router.navigate(['catalog/list', { code: -1 }]);
        break;
      }
    }
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

  private success() {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;
    this.router.navigate(['catalog/list', { code: 200 }]);
  }

  private track(order: Order[]) {
    const result = order.map(purchase => ({ item_id: purchase.item_id, bump_type: purchase.product_id }));
    const itemsIds = Object.keys(order).map(key => order[key].item_id);

    const payment_method = PAYMENT_METHOD.STRIPE;
    const attributes = this.totalToPay === 0 ? { selected_products: result } : { selected_products: result, payment_method };
    this.trackingService.track(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, attributes);

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
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
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
