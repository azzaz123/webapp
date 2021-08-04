import { Injectable } from '@angular/core';
import { DeliveryRulesApiService } from '@api/bff/delivery/rules/delivery-rules-api.service';
import { ShippingRules } from '@api/bff/delivery/rules/dtos/shipping-rules';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShippingToggleAllowance } from './interfaces/shipping-toggle-allowance.interface';

@Injectable()
export class ShippingToggleService {
  private shippingRulesSubject: ReplaySubject<ShippingRules> = new ReplaySubject<ShippingRules>();
  public shippingRules: ShippingRules;

  constructor(private featureFlagService: FeatureFlagService, private deliveryRulesApiService: DeliveryRulesApiService) {
    this.deliveryRulesApiService.getRules().subscribe((shippingRules) => {
      this.shippingRulesSubject.next(shippingRules);
    });
  }

  public isActive(): Observable<boolean> {
    return this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.SHIPPING_TOGGLE).pipe(
      map((isActive) => isActive),
      catchError(() => of(false))
    );
  }

  public isAllowed(categoryId: string, subcategoryId: string, price: number): Observable<ShippingToggleAllowance> {
    if (!this.shippingRules) {
      return this.shippingRulesSubject.asObservable().pipe(
        map((shippingRules) => {
          this.shippingRules = shippingRules;
          return this.buildShippingToggleAllowance(categoryId, subcategoryId, price);
        })
      );
    } else {
      return of(this.buildShippingToggleAllowance(categoryId, subcategoryId, price));
    }
  }

  private buildShippingToggleAllowance(categoryId: string, subcategoryId: string, price: number): ShippingToggleAllowance {
    return {
      category: this.isAllowedByCategoryShippingRules(categoryId),
      subcategory: this.isAllowedBySubcategoryShippingRules(subcategoryId),
      price: this.isAllowedByPriceShippingRules(price),
    };
  }

  private isAllowedByCategoryShippingRules(categoryId: string): boolean {
    return !this.shippingRules.categoriesNotAllowed.includes(parseInt(categoryId));
  }

  private isAllowedBySubcategoryShippingRules(subcategoryId: string): boolean {
    return !this.shippingRules.subcategoriesNotAllowed.includes(parseInt(subcategoryId));
  }

  private isAllowedByPriceShippingRules(price: number): boolean {
    return price >= this.shippingRules.priceRangeAllowed.minPrice && price <= this.shippingRules.priceRangeAllowed.maxPrice;
  }
}
