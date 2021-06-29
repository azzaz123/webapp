export interface ShippingRulesResponse {
  categories_with_shipping_not_allowed: number[];
  subcategories_with_shipping_not_allowed: number[];
  price_range_allowed: {
    max_price: number;
    min_price: number;
  };
}
