import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 63.0, currency: 'EUR' },
    delivery_cost: { amount: 13.95, currency: 'EUR' },
    fees: { amount: 6.03, currency: 'EUR' },
    total: { amount: 82.98, currency: 'EUR' },
  },
  promocode: null,
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 56.7, currency: 'EUR' },
    delivery_cost: { amount: 1.0, currency: 'EUR' },
    fees: { amount: 2.5, currency: 'EUR' },
    total: { amount: 59.2, currency: 'EUR' },
  },
  promocode: {
    delivery_cost_discount_percentage: 10,
    fees_discount_percentage: 0,
    delivery_cost_fixed_price: { amount: 1.0, currency: 'EUR' },
    fees_fixed_price: { amount: 2.5, currency: 'EUR' },
    original_buyer_cost: {
      product_price: { amount: 63.0, currency: 'EUR' },
      delivery_cost: { amount: 13.95, currency: 'EUR' },
      fees: { amount: 6.03, currency: 'EUR' },
      total: { amount: 82.98, currency: 'EUR' },
    },
    promocode: 'fakepromocode123321',
  },
};
export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 63, decimals: 0, total: 63.0 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 13, decimals: 95, total: 13.95 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 82, decimals: 98, total: 82.98 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: null,
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 56.7, currency: 'EUR' },
    delivery_cost: { amount: 1.0, currency: 'EUR' },
    fees: { amount: 2.5, currency: 'EUR' },
    total: { amount: 59.2, currency: 'EUR' },
  },
  promotion: {
    delivery_cost_discount_percentage: 10,
    fees_discount_percentage: 0,
    original_buyer_cost: {
      product_price: { amount: 63.0, currency: 'EUR' },
      delivery_cost: { amount: 13.95, currency: 'EUR' },
      fees: { amount: 6.03, currency: 'EUR' },
      total: { amount: 82.98, currency: 'EUR' },
    },
    description: 'Hola!!',
  },
};
export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 10,
    deliveryCostFixedPrice: {
      amount: {
        decimals: 56,
        integer: 12,
        total: 12.555,
      },
      currency: {
        code: 'EUR',
        symbol: '€',
      },
    },
    feesDiscountPercentatge: 0,
    feesFixedPrice: null,
    originalBuyerCost: {
      deliveryCost: {
        amount: {
          decimals: 95,
          integer: 13,
          total: 13.95,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      fees: {
        amount: {
          decimals: 3,
          integer: 6,
          total: 6.03,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      productPrice: {
        amount: {
          decimals: 0,
          integer: 63,
          total: 63,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      total: {
        amount: {
          decimals: 98,
          integer: 82,
          total: 82.98,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
    },
    promocode: null,
    promotionName: 'Hola!!',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE_RESPONSE: DeliveryBuyerCalculatorCostsDto =
  {
    buyer_cost: {
      product_price: { amount: 56.7, currency: 'EUR' },
      delivery_cost: { amount: 1.0, currency: 'EUR' },
      fees: { amount: 2.5, currency: 'EUR' },
      total: { amount: 59.2, currency: 'EUR' },
    },
    promotion: {
      delivery_cost_discount_percentage: 0,
      fees_discount_percentage: 0,
      original_buyer_cost: {
        product_price: { amount: 63.0, currency: 'EUR' },
        delivery_cost: { amount: 13.95, currency: 'EUR' },
        fees: { amount: 6.03, currency: 'EUR' },
        total: { amount: 82.98, currency: 'EUR' },
      },
      description: 'Hola!!',
    },
  };
export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 0,
    deliveryCostFixedPrice: null,
    feesDiscountPercentatge: 0,
    feesFixedPrice: null,
    originalBuyerCost: {
      deliveryCost: {
        amount: {
          decimals: 95,
          integer: 13,
          total: 13.95,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      fees: {
        amount: {
          decimals: 3,
          integer: 6,
          total: 6.03,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      productPrice: {
        amount: {
          decimals: 0,
          integer: 63,
          total: 63,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      total: {
        amount: {
          decimals: 98,
          integer: 82,
          total: 82.98,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
    },
    promocode: null,
    promotionName: 'Hola!!',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 56.7, currency: 'EUR' },
    delivery_cost: { amount: 1.0, currency: 'EUR' },
    fees: { amount: 2.5, currency: 'EUR' },
    total: { amount: 59.2, currency: 'EUR' },
  },
  promotion: {
    delivery_cost_discount_percentage: 10,
    fees_discount_percentage: 20,
    original_buyer_cost: {
      product_price: { amount: 63.0, currency: 'EUR' },
      delivery_cost: { amount: 13.95, currency: 'EUR' },
      fees: { amount: 6.03, currency: 'EUR' },
      total: { amount: 82.98, currency: 'EUR' },
    },
    description: 'Hola!!',
  },
};
export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 10,
    deliveryCostFixedPrice: {
      amount: {
        decimals: 56,
        integer: 12,
        total: 12.555,
      },
      currency: {
        code: 'EUR',
        symbol: '€',
      },
    },
    feesDiscountPercentatge: 20,
    feesFixedPrice: {
      amount: {
        decimals: 82,
        integer: 4,
        total: 4.824,
      },
      currency: {
        code: 'EUR',
        symbol: '€',
      },
    },
    originalBuyerCost: {
      deliveryCost: {
        amount: {
          decimals: 95,
          integer: 13,
          total: 13.95,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      fees: {
        amount: {
          decimals: 3,
          integer: 6,
          total: 6.03,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      productPrice: {
        amount: {
          decimals: 0,
          integer: 63,
          total: 63,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      total: {
        amount: {
          decimals: 98,
          integer: 82,
          total: 82.98,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
    },
    promocode: null,
    promotionName: 'Hola!!',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE_RESPONSE: DeliveryBuyerCalculatorCostsDto =
  {
    buyer_cost: {
      product_price: { amount: 56.7, currency: 'EUR' },
      delivery_cost: { amount: 1.0, currency: 'EUR' },
      fees: { amount: 2.5, currency: 'EUR' },
      total: { amount: 59.2, currency: 'EUR' },
    },
    promotion: {
      delivery_cost_discount_percentage: 10,
      fees_discount_percentage: 0,
      original_buyer_cost: {
        product_price: { amount: 63.0, currency: 'EUR' },
        delivery_cost: { amount: 13.95, currency: 'EUR' },
        fees: { amount: 6.03, currency: 'EUR' },
        total: { amount: 82.98, currency: 'EUR' },
      },
      description: 'Hola!!',
    },
  };
export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 10,
    deliveryCostFixedPrice: {
      amount: {
        decimals: 56,
        integer: 12,
        total: 12.555,
      },
      currency: {
        code: 'EUR',
        symbol: '€',
      },
    },
    feesDiscountPercentatge: 0,
    feesFixedPrice: null,
    originalBuyerCost: {
      deliveryCost: {
        amount: {
          decimals: 95,
          integer: 13,
          total: 13.95,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      fees: {
        amount: {
          decimals: 3,
          integer: 6,
          total: 6.03,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      productPrice: {
        amount: {
          decimals: 0,
          integer: 63,
          total: 63,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
      total: {
        amount: {
          decimals: 98,
          integer: 82,
          total: 82.98,
        },
        currency: {
          code: 'EUR',
          symbol: '€',
        },
      },
    },
    promocode: null,
    promotionName: 'Hola!!',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 10,
    feesDiscountPercentatge: 0,
    deliveryCostFixedPrice: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    feesFixedPrice: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    originalBuyerCost: {
      productPrice: { amount: { integer: 63, decimals: 0, total: 63.0 }, currency: { code: 'EUR', symbol: '€' } },
      deliveryCost: { amount: { integer: 13, decimals: 95, total: 13.95 }, currency: { code: 'EUR', symbol: '€' } },
      fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
      total: { amount: { integer: 82, decimals: 98, total: 82.98 }, currency: { code: 'EUR', symbol: '€' } },
    },
    promotionName: null,
    promocode: 'fakepromocode123321',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    deliveryCostDiscountPercentage: 10,
    feesDiscountPercentatge: 0,
    deliveryCostFixedPrice: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    feesFixedPrice: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    originalBuyerCost: {
      productPrice: { amount: { integer: 63, decimals: 0, total: 63.0 }, currency: { code: 'EUR', symbol: '€' } },
      deliveryCost: { amount: { integer: 13, decimals: 95, total: 13.95 }, currency: { code: 'EUR', symbol: '€' } },
      fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
      total: { amount: { integer: 82, decimals: 98, total: 82.98 }, currency: { code: 'EUR', symbol: '€' } },
    },
    promotionName: 'Employees promotion',
    promocode: 'fakepromocode123321',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 56.7, currency: 'EUR' },
    delivery_cost: { amount: 1.0, currency: 'EUR' },
    fees: { amount: 2.5, currency: 'EUR' },
    total: { amount: 59.2, currency: 'EUR' },
  },
  promocode: {
    delivery_cost_discount_percentage: 10,
    delivery_cost_fixed_price: null,
    fees_discount_percentage: 0,
    fees_fixed_price: { amount: 2.5, currency: 'EUR' },
    original_buyer_cost: {
      product_price: { amount: 63.0, currency: 'EUR' },
      delivery_cost: { amount: 13.95, currency: 'EUR' },
      fees: { amount: 6.03, currency: 'EUR' },
      total: { amount: 82.98, currency: 'EUR' },
    },
    promocode: 'fakepromocode123321',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    feesDiscountPercentatge: 0,
    deliveryCostDiscountPercentage: 10,
    deliveryCostFixedPrice: null,
    feesFixedPrice: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    originalBuyerCost: {
      productPrice: { amount: { integer: 63, decimals: 0, total: 63.0 }, currency: { code: 'EUR', symbol: '€' } },
      deliveryCost: { amount: { integer: 13, decimals: 95, total: 13.95 }, currency: { code: 'EUR', symbol: '€' } },
      fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
      total: { amount: { integer: 82, decimals: 98, total: 82.98 }, currency: { code: 'EUR', symbol: '€' } },
    },
    promotionName: null,
    promocode: 'fakepromocode123321',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST_RESPONSE: DeliveryBuyerCalculatorCostsDto = {
  buyer_cost: {
    product_price: { amount: 56.7, currency: 'EUR' },
    delivery_cost: { amount: 1.0, currency: 'EUR' },
    fees: { amount: 2.5, currency: 'EUR' },
    total: { amount: 59.2, currency: 'EUR' },
  },
  promocode: {
    delivery_cost_discount_percentage: 10,
    delivery_cost_fixed_price: null,
    fees_fixed_price: null,
    fees_discount_percentage: 0,
    original_buyer_cost: {
      product_price: { amount: 63.0, currency: 'EUR' },
      delivery_cost: { amount: 13.95, currency: 'EUR' },
      fees: { amount: 6.03, currency: 'EUR' },
      total: { amount: 82.98, currency: 'EUR' },
    },
    promocode: 'fakepromocode123321',
  },
};

export const MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST: DeliveryBuyerCalculatorCosts = {
  buyerCost: {
    productPrice: { amount: { integer: 56, decimals: 70, total: 56.7 }, currency: { code: 'EUR', symbol: '€' } },
    deliveryCost: { amount: { integer: 1, decimals: 0, total: 1.0 }, currency: { code: 'EUR', symbol: '€' } },
    fees: { amount: { integer: 2, decimals: 50, total: 2.5 }, currency: { code: 'EUR', symbol: '€' } },
    total: { amount: { integer: 59, decimals: 20, total: 59.2 }, currency: { code: 'EUR', symbol: '€' } },
  },
  promotion: {
    feesDiscountPercentatge: 0,
    promotionName: null,
    deliveryCostDiscountPercentage: 10,
    deliveryCostFixedPrice: null,
    feesFixedPrice: null,
    originalBuyerCost: {
      productPrice: { amount: { integer: 63, decimals: 0, total: 63.0 }, currency: { code: 'EUR', symbol: '€' } },
      deliveryCost: { amount: { integer: 13, decimals: 95, total: 13.95 }, currency: { code: 'EUR', symbol: '€' } },
      fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
      total: { amount: { integer: 82, decimals: 98, total: 82.98 }, currency: { code: 'EUR', symbol: '€' } },
    },
    promocode: 'fakepromocode123321',
  },
};
