import { DeliveryCostsItem } from '@api/bff/delivery/costs/interfaces/delivery-costs-item.interface';
import { DeliveryCostsItemDto } from '@api/bff/delivery/costs/dtos';

export const MOCK_DELIVERY_COSTS_ITEM: DeliveryCostsItem = {
  buyerAddressCost: {
    amount: {
      integer: 13,
      decimals: 95,
      total: 13.95,
      toString(): string {
        return '13.95';
      },
    },
    currency: { code: 'EUR', symbol: '€' },
  },
  carrierOfficeCost: {
    amount: {
      integer: 11,
      decimals: 95,
      total: 11.95,
      toString(): string {
        return '11.95';
      },
    },
    currency: { code: 'EUR', symbol: '€' },
  },
};

export const MOCK_DELIVERY_COSTS_RESPONSE: DeliveryCostsItemDto = {
  buyer_address_cost: { amount: 13.95, currency: 'EUR' },
  carrier_office_cost: { amount: 11.95, currency: 'EUR' },
};
