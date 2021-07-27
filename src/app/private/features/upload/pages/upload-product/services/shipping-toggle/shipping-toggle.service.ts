import { Injectable } from '@angular/core';
import { DeliveryRulesApiService } from '@api/bff/delivery/rules/delivery-rules-api.service';
import { ShippingRules } from '@api/bff/delivery/rules/dtos/shipping-rules';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ShippingToggleService {
  private shippingRulesSubject: ReplaySubject<ShippingRules> = new ReplaySubject<ShippingRules>();
  public shippingRules: ShippingRules;

  constructor(private featureFlagService: FeatureFlagService, private deliveryRulesApiService: DeliveryRulesApiService) {
    this.deliveryRulesApiService.getRules().subscribe((shippingRules) => {
      this.shippingRulesSubject.next(shippingRules);
    });
  }

  isActive(): Observable<boolean> {
    return this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.SHIPPING_TOGGLE).pipe(
      map((isActive) => isActive),
      catchError(() => of(false))
    );
  }

  isAllowed(categoryId: string, subcategoryId: string, price: number): Observable<boolean> {
    if (!this.shippingRules) {
      return this.shippingRulesSubject.asObservable().pipe(
        map((shippingRules) => {
          this.shippingRules = shippingRules;
          return this.isActiveByShippingRules(categoryId, subcategoryId, price);
        })
      );
    } else {
      return of(this.isActiveByShippingRules(categoryId, subcategoryId, price));
    }
  }

  private isActiveByShippingRules(categoryId: string, subcategoryId: string, price: number): boolean {
    const categoryAllowed = !this.shippingRules.categoriesNotAllowed.includes(parseInt(categoryId));
    const subcategoryAllowed = !this.shippingRules.subcategoriesNotAllowed.includes(parseInt(subcategoryId));
    const priceAllowed = price >= this.shippingRules.priceRangeAllowed.minPrice && price <= this.shippingRules.priceRangeAllowed.maxPrice;
    return categoryAllowed && subcategoryAllowed && priceAllowed;
  }
}
