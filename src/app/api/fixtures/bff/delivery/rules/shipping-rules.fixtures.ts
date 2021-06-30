import { ShippingRulesResponse } from '@api/bff/delivery/rules/dtos/shipping-rules-response';
import { ShippingRules } from '@api/bff/delivery/rules/dtos/shipping-rules';

const categories = [1, 2, 3];
const subcategories = [4, 5, 6];
const maxPrice = 500;
const minPrice = 200;

export const shippingRulesResponseFixture: ShippingRulesResponse = {
  categories_with_shipping_not_allowed: categories,
  subcategories_with_shipping_not_allowed: subcategories,
  price_range_allowed: {
    max_price: maxPrice,
    min_price: minPrice,
  },
};

export const mappedShippingRulesFixture: ShippingRules = {
  categoriesNotAllowed: categories,
  subcategoriesNotAllowed: subcategories,
  priceRangeAllowed: {
    maxPrice: maxPrice,
    minPrice: minPrice,
  },
};
