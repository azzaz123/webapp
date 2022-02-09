import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemsBySubscription, ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UuidService } from '@core/uuid/uuid.service';
import { CartBase } from '@shared/catalog/cart/cart-base';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BumpsHttpService } from './http/bumps.service';
import { mapBalance, mapFreeBumpsPurchase, mapItemsWithProducts, mapItemWithProductsAndSubscriptionBumps } from './mappers/bumps-mapper';
import { groupBy } from 'lodash-es';

@Injectable()
export class VisibilityApiService {
  constructor(
    private bumpsHttpService: BumpsHttpService,
    private uuidService: UuidService,
    private subscriptionService: SubscriptionsService
  ) {}

  public getBalance(userId: string): Observable<BumpsPackageBalance[]> {
    return this.bumpsHttpService.getBalance(userId).pipe(map(mapBalance));
  }

  public bumpWithPackage(cart: CartBase): Observable<unknown> {
    const itemsMapped = mapFreeBumpsPurchase(cart, this.uuidService);
    return itemsMapped.length === 0 ? of(true) : this.bumpsHttpService.useBumpPackage(itemsMapped).pipe(catchError((error) => of(error)));
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
        const a = groupBy(itemsByProducts, 'subscription.type');

        const b: ItemsBySubscription[] = [];
        const keys = Object.keys(a);
        for (const key of keys) {
          if (key === undefined) {
            b.push({
              items: a[key],
              subscription: null,
            });
          } else {
            b.unshift({
              items: a[key],
              subscription: a[key][0].subscription,
            });
          }
        }
        return b;
      })
    );
  }
}
