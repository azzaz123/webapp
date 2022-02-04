import { finalize, takeWhile } from 'rxjs/operators';
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
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { PACKS_TYPES } from '@core/payments/pack';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

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
  public loading: boolean;
  public card: any;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public readonly BUMP_TYPES = BUMP_TYPE;
  public readonly PACK_TYPES = PACKS_TYPES;
  public readonly ICON_TYPE = ICON_TYPE;

  public purchaseBumpsSubject = new BehaviorSubject<boolean>(false);

  public get experimentReady$(): Observable<boolean> {
    return this.purchaseBumpsSubject.asObservable();
  }
  private active = true;

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private eventService: EventService,
    private router: Router,
    private uuidService: UuidService,
    private stripeService: StripeService,
    private visibilityService: VisibilityApiService
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

  public checkout(): void {
    if (this.loading) {
      return;
    }
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    this.loading = true;
    setTimeout(() => {
      forkJoin([this.experimentReady$, this.visibilityService.bumpWithPackage(this.cart)])
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(() => {
          this.success();
        });
      this.purchaseBumps(order, orderId);
    }, 2000);
  }

  public purchaseBumps(order: Order[], orderId: string): void {
    if (order.length === 0) {
      this.purchaseBumpsSubject.complete();
      return;
    }
    this.track(order);
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
          this.purchaseBumpsSubject.complete();
        }
      },
      (e: HttpErrorResponse) => {
        this.purchaseBumpsSubject.error(e);
        if (e.error) {
          this.errorService.show(e);
        } else {
          this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
        }
      }
    );
  }

  public addNewCard(): void {
    this.showCard = true;
    this.savedCard = false;
  }

  public removeNewCard(): void {
    this.showCard = false;
    this.savedCard = true;
  }

  public setSavedCard(selectedCard: FinancialCardOption): void {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }

  public hasCard(hasCard: boolean): void {
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
        this.purchaseBumpsSubject.complete();
        break;
      }
      default: {
        this.router.navigate(['catalog/list', { code: -1 }]);
        break;
      }
    }
  }

  private buyStripe(orderId: string): void {
    const paymentId: string = this.uuidService.getUUID();

    if (this.selectedCard || !this.savedCard) {
      this.stripeService.buy(orderId, paymentId, this.hasSavedCard, this.savedCard, this.card);
    } else {
      this.loading = false;
      this.errorService.i18nError(TRANSLATION_KEY.NO_CARD_SELECTED_ERROR);
    }
  }

  private success(): void {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;
    this.router.navigate(['catalog/list', { code: 200 }]);
  }

  private track(order: Order[]): void {
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
    if (!this.cart || !this.creditInfo) {
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
    if (!this.cart || !this.creditInfo) {
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
