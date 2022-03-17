import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import {
  BumpRequestSubject,
  BUMP_SERVICE_TYPE,
  ItemsBySubscription,
  ItemWithProducts,
  SelectedProduct,
} from '@api/core/model/bumps/item-products.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UuidService } from '@core/uuid/uuid.service';
import { CartBase } from '@shared/catalog/cart/cart-base';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BumpsHttpService } from './http/bumps.service';
import { mapBalance, mapFreeBumpsPurchase, mapItemsWithProducts, mapItemWithProductsAndSubscriptionBumps } from './mappers/bumps-mapper';
import { groupBy } from 'lodash-es';
import { Order, PurchaseProductsWithCreditsResponse } from '@core/item/item-response.interface';
import { EventService } from '@core/event/event.service';
import { CartService } from '@shared/catalog/cart/cart.service';
import { Cart } from '@shared/catalog/cart/cart';
import { ItemService } from '@core/item/item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PAYMENT_RESPONSE_STATUS } from '@core/payments/payment.service';
import { StripeService } from '@core/stripe/stripe.service';
import { FinancialCardOption } from '@core/payments/payment.interface';

@Injectable()
export class VisibilityApiService {
  private stripeResponseSubject: ReplaySubject<BumpRequestSubject>;

  constructor(
    private bumpsHttpService: BumpsHttpService,
    private uuidService: UuidService,
    private subscriptionService: SubscriptionsService,
    private eventService: EventService,
    private cartService: CartService,
    private itemService: ItemService,
    private stripeService: StripeService
  ) {}

  public getBalance(userId: string): Observable<BumpsPackageBalance[]> {
    return this.bumpsHttpService.getBalance(userId).pipe(map(mapBalance));
  }

  public isAvailableToUseFreeBump(userId: string, itemId: string): Observable<boolean> {
    return this.bumpsHttpService.getItemsBalance(userId, [itemId]).pipe(
      map((balance) => balance.balance_check[0].has_balance),
      catchError(() => of(false))
    );
  }

  public getItemsWithProductsAndSubscriptionBumps(ids: string[]): Observable<ItemsBySubscription[]> {
    return forkJoin([
      this.bumpsHttpService.getItemsWithAvailableProducts(ids).pipe(map(mapItemsWithProducts)),
      this.subscriptionService.getSubscriptions(),
    ]).pipe(
      map(([itemWithProducts, subscriptions]) => {
        const itemsByProducts = itemWithProducts.map((item) =>
          mapItemWithProductsAndSubscriptionBumps(
            item,
            this.subscriptionService.getSubscriptionByCategory(subscriptions, item.item.categoryId)
          )
        );
        const itemsBySubscriptionType: Record<string, ItemWithProducts[]> = groupBy(itemsByProducts, 'subscription.type');
        const subscriptionsKeys = Object.keys(itemsBySubscriptionType);
        const itemsBySubscription: ItemsBySubscription[] = [];
        for (const key of subscriptionsKeys) {
          if (key === 'undefined') {
            itemsBySubscription.push({
              items: itemsBySubscriptionType[key],
              subscription: null,
              availableFreeBumps: null,
            });
          } else {
            itemsBySubscription.unshift({
              items: itemsBySubscriptionType[key],
              subscription: itemsBySubscriptionType[key][0].subscription,
              availableFreeBumps: itemsBySubscriptionType[key][0].subscription.selected_tier.bumps.reduce(
                (a, b) => a + b.quantity - b.used,
                0
              ),
            });
          }
        }
        return itemsBySubscription;
      })
    );
  }

  public buyBumps(
    selectedItems: SelectedProduct[],
    hasSavedCards: boolean,
    isNewCard: boolean,
    card: FinancialCardOption | stripe.elements.Element
  ): Observable<BumpRequestSubject[]> {
    const subscriptionBumps: SelectedProduct[] = [];
    const stripeBumps: SelectedProduct[] = [];
    const subscriptions: Observable<BumpRequestSubject>[] = [];

    selectedItems.forEach((item) => {
      item.isFree ? subscriptionBumps.push(item) : stripeBumps.push(item);
    });

    if (stripeBumps.length) {
      this.stripeResponseSubject = new ReplaySubject(1);
      this.cartService.createInstance(new Cart());
      let cart: CartBase;
      this.cartService.cart$.subscribe((cartChanges) => {
        cart = cartChanges.cart;
      });

      stripeBumps.forEach((item) => {
        this.cartService.add(item, item.productType);
      });

      this.eventService.subscribe('paymentResponse', (response) => {
        this.managePaymentResponse(response);
      });

      setTimeout(() => {
        const order: Order[] = cart.prepareOrder();
        const orderId: string = cart.getOrderId();
        this.purchaseStripeBumps(order, orderId, hasSavedCards, isNewCard, card);
      });

      subscriptions.push(
        this.stripeResponseSubject.pipe(catchError((error) => of({ hasError: true, error, service: BUMP_SERVICE_TYPE.STRIPE })))
      );
    }

    if (subscriptionBumps.length) {
      subscriptions.push(
        this.bumpWithPackage(subscriptionBumps).pipe(
          catchError((error: HttpErrorResponse) =>
            of({ hasError: true, error, errorCode: error.status, service: BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS })
          )
        )
      );
    }

    return forkJoin(subscriptions);
  }

  private purchaseStripeBumps(
    order: Order[],
    orderId: string,
    hasSavedCard: boolean,
    isNewCard: boolean,
    card: FinancialCardOption | stripe.elements.Element
  ): void {
    this.stripeResponseSubject.next({ service: BUMP_SERVICE_TYPE.STRIPE });
    this.itemService.purchaseProductsWithCredits(order, orderId).subscribe(
      (response: PurchaseProductsWithCreditsResponse) => {
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
        if (response.payment_needed) {
          const paymentId: string = this.uuidService.getUUID();
          this.stripeService.buy(orderId, paymentId, hasSavedCard, !isNewCard, card, true);
        } else {
          this.stripeResponseSubject.complete();
        }
      },
      (e: HttpErrorResponse) => {
        this.stripeResponseSubject.next({ hasError: true, error: e, service: BUMP_SERVICE_TYPE.STRIPE, errorCode: e.status });
        this.stripeResponseSubject.complete();
      }
    );
    this.cartService.clean();
  }

  private bumpWithPackage(cart: SelectedProduct[]): Observable<unknown> {
    const itemsMapped = mapFreeBumpsPurchase(cart, this.uuidService);
    return this.bumpsHttpService.useBumpPackage(itemsMapped);
  }

  private managePaymentResponse(paymentResponse: string): void {
    if (paymentResponse && paymentResponse.toUpperCase() !== PAYMENT_RESPONSE_STATUS.SUCCEEDED) {
      this.stripeResponseSubject.next({ hasError: true, error: paymentResponse, service: BUMP_SERVICE_TYPE.STRIPE });
    }
    this.stripeResponseSubject.complete();
  }
}
