import { ShippingRulesResponse } from '../interfaces/shipping-rules-response.interface';
import { ShippingRules } from '../interfaces/shipping-rules.interface';

export function mapShippingRulesResponseToShippingRules(shippingRulesResponse: ShippingRulesResponse): ShippingRules {
  return {
    categoriesNotAllowed: shippingRulesResponse.categories_with_shipping_not_allowed,
    subcategoriesNotAllowed: shippingRulesResponse.subcategories_with_shipping_not_allowed,
    priceRangeAllowed: {
      minPrice: shippingRulesResponse.price_range_allowed.min_price,
      maxPrice: shippingRulesResponse.price_range_allowed.max_price,
    },
  };
}
