import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { BumpRequestSubject, ItemsBySubscription, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
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

@Injectable()
export class VisibilityApiService {
  private stripeResponseSubject: ReplaySubject<BumpRequestSubject> = new ReplaySubject(1);

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

  public bumpWithPackage(cart: SelectedProduct[]): Observable<unknown> {
    const itemsMapped = mapFreeBumpsPurchase(cart, this.uuidService);
    return this.bumpsHttpService.useBumpPackage(itemsMapped);
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
        const itemsBySubscriptionType = groupBy(itemsByProducts, 'subscription.type');
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
    hasSavedCard: boolean,
    savedCard: boolean,
    card: boolean
  ): Observable<BumpRequestSubject[]> {
    const subscriptionBumps: SelectedProduct[] = [];
    const stripeBumps: SelectedProduct[] = [];
    const subscriptions: Observable<BumpRequestSubject>[] = [];

    selectedItems.forEach((item) => {
      item.isFree ? subscriptionBumps.push(item) : stripeBumps.push(item);
    });

    if (stripeBumps.length) {
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
        this.purchaseStripeBumps(order, orderId, hasSavedCard, savedCard, card);
      });

      subscriptions.push(this.stripeResponseSubject.pipe(catchError((error) => of({ hasError: true, error }))));
    }

    if (subscriptionBumps.length) {
      subscriptions.push(this.bumpWithPackage(subscriptionBumps).pipe(catchError((error) => of({ hasError: true, error }))));
    }

    return forkJoin(subscriptions);
  }

  private purchaseStripeBumps(order: Order[], orderId: string, hasSavedCard: boolean, savedCard: boolean, card: any): void {
    this.stripeResponseSubject.next({ loading: true });
    this.itemService.purchaseProductsWithCredits(order, orderId).subscribe(
      (response: PurchaseProductsWithCreditsResponse) => {
        this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
        if (response.payment_needed) {
          const paymentId: string = this.uuidService.getUUID();
          this.stripeService.buy(orderId, paymentId, hasSavedCard, savedCard, card);
        } else {
          this.stripeResponseSubject.complete();
        }
      },
      (e: HttpErrorResponse) => {
        this.stripeResponseSubject.next({ hasError: true, error: e });
        this.stripeResponseSubject.complete();
      }
    );
    this.cartService.clean();
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch (paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.stripeResponseSubject.complete();
        break;
      }
      default: {
        this.stripeResponseSubject.next({ hasError: true, error: paymentResponse });
        this.stripeResponseSubject.complete();
        break;
      }
    }
  }
}
