import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SELLER_PAYMENT_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-payment-status.enum';
import { SELLER_REQUEST_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-request-status.enum';

export const MOCK_SELLER_REQUEST: SellerRequest = {
  id: '1928192',
  itemId: 'sas23cdf2323',
  buyer: {
    id: 'usd2y82b3',
    address: {
      city: 'Barcelona',
      country: 'ES',
    },
  },
  creationDate: new Date('2021-10-22T10:57:14Z'),
  failReason: {
    payment: SELLER_PAYMENT_STATUS.PENDING,
    request: SELLER_REQUEST_STATUS.CANCELLED,
  },
  offeredPrice: mapNumberAndCurrencyCodeToMoney({ number: 11, currency: 'EUR' as CurrencyCode }),
  sellerRevenue: {
    deliveryCost: mapNumberAndCurrencyCodeToMoney({ number: 2, currency: 'EUR' as CurrencyCode }),
    feesCost: mapNumberAndCurrencyCodeToMoney({ number: 1, currency: 'EUR' as CurrencyCode }),
    itemPrice: mapNumberAndCurrencyCodeToMoney({ number: 11, currency: 'EUR' as CurrencyCode }),
    totalPrice: mapNumberAndCurrencyCodeToMoney({ number: 14, currency: 'EUR' as CurrencyCode }),
  },
  status: {
    payment: SELLER_PAYMENT_STATUS.SUCCEEDED,
    request: SELLER_REQUEST_STATUS.ACCEPTED,
  },
};
