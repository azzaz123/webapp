import { Injectable } from '@angular/core';
import { DeliveryRulesApiService } from '@api/bff/delivery/rules/delivery-rules-api.service';
import { ShippingRules } from '@api/bff/delivery/rules/dtos/shipping-rules';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShippingToggleAllowance } from './interfaces/shipping-toggle-allowance.interface';

@Injectable()
export class ShippingToggleService {
  public shippingRules: ShippingRules;
  private shippingRulesSubject: ReplaySubject<ShippingRules> = new ReplaySubject<ShippingRules>();

  constructor(private deliveryRulesApiService: DeliveryRulesApiService) {
    this.deliveryRulesApiService.getRules().subscribe((shippingRules) => {
      this.shippingRulesSubject.next(shippingRules);
    });
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
      category: !categoryId ? true : this.isAllowedByCategoryShippingRules(categoryId),
      subcategory: !subcategoryId ? true : this.isAllowedBySubcategoryShippingRules(subcategoryId),
      price: price === (null || undefined) ? true : this.isAllowedByPriceShippingRules(price),
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
