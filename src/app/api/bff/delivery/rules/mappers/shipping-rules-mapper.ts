import { ShippingRulesResponse } from '../dtos/shipping-rules-response';
import { ShippingRules } from '../dtos/shipping-rules';

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
