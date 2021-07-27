export interface ShippingRules {
  categoriesNotAllowed: number[];
  subcategoriesNotAllowed: number[];
  priceRangeAllowed: ShippingRulesPriceRangeAllowed;
}

export interface ShippingRulesPriceRangeAllowed {
  maxPrice: number;
  minPrice: number;
}
