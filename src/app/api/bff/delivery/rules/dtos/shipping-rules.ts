export interface ShippingRules {
  categoriesNotAllowed: number[];
  subcategoriesNotAllowed: number[];
  priceRangeAllowed: {
    maxPrice: number;
    minPrice: number;
  };
}
