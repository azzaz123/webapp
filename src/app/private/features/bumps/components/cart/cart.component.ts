import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { CartService } from '@shared/catalog/cart/cart.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { Order, PurchaseProductsWithCreditsResponse } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { CreditInfo, FinancialCardOption } from '@core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS, PAYMENT_METHOD } from '@core/payments/payment.service';
import { StripeService } from '@core/stripe/stripe.service';
import { UuidService } from '@core/uuid/uuid.service';
import { Cart } from '@shared/catalog/cart/cart';
import { CartBase, BUMP_TYPES } from '@shared/catalog/cart/cart-base';
import { CartChange, CartItem } from '@shared/catalog/cart/cart-item.interface';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  @Input() provincialBump: boolean;
  @Input() creditInfo: CreditInfo;
  public cart: CartBase;
  public types: string[] = BUMP_TYPES;
  public hasSavedCard = true;
  public cardType = 'old';
  public loading: boolean;
  public card: any;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;

  private active = true;

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private eventService: EventService,
    private router: Router,
    private uuidService: UuidService,
    private stripeService: StripeService
  ) {
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
      this.itemService.purchaseProductsWithCredits(order, orderId).subscribe(
        (response: PurchaseProductsWithCreditsResponse) => {
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
        },
        (e: HttpErrorResponse) => {
          this.loading = false;
          if (e.error) {
            this.errorService.show(e);
          } else {
            this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
          }
        }
      );
    }, 2000);
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

  public handleIconPath(type: string): string {
    const iconBump = type.replace('bump', '');
    return `/assets/icons/wing-${iconBump}.svg`;
  }

  public hasCard(hasCard: boolean) {
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: any): void {
    this.card = card;
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch (paymentResponse && paymentResponse.toUpperCase()) {
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
    const paymentId: string = this.uuidService.getUUID();

    if (this.selectedCard || !this.savedCard) {
      this.stripeService.buy(orderId, paymentId, this.hasSavedCard, this.savedCard, this.card);
    } else {
      this.loading = false;
      this.errorService.i18nError(TRANSLATION_KEY.NO_CARD_SELECTED_ERROR);
    }
  }

  private success() {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;
    this.router.navigate(['catalog/list', { code: 200 }]);
  }

  private track(order: Order[]) {
    const result = order.map((purchase) => ({
      item_id: purchase.item_id,
      bump_type: purchase.product_id,
    }));
    const itemsIds = Object.keys(order).map((key) => order[key].item_id);

    const payment_method = PAYMENT_METHOD.STRIPE;
    const attributes = this.totalToPay === 0 ? { selected_products: result } : { selected_products: result, payment_method };

    ga('send', 'event', 'Item', 'bump-cart');
    fbq('track', 'Purchase', {
      value: this.cart.total,
      currency: 'EUR',
      content_ids: itemsIds,
      content_type: 'product',
    });
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
