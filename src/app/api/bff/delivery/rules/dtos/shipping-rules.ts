export interface ShippingRules {
  categoriesNotAllowed: number[];
  subcategoriesNotAllowed: number[];
  priceRangeAllowed: ShippingRulesPrice;
}

export interface ShippingRulesPrice {
  maxPrice: number;
  minPrice: number;
}
