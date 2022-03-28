import {
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS,
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS_WITHOUT_LASTADDRESSUSED,
} from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES } from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS } from '@api/fixtures/delivery/address/delivery-address.fixtures.spec';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2 } from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY } from '@api/fixtures/payments/wallets/payments-wallets.fixtures.spec';
import { MOCK_PAYVIEW_ITEM } from '@fixtures/private/delivery/payview/payview-item.fixtures.spec';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

export const MOCK_PAYVIEW_STATE: PayviewState = {
  costs: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  delivery: {
    address: MOCK_DELIVERY_ADDRESS,
    costs: MOCK_DELIVERY_COSTS_ITEM,
    methods: MOCK_DELIVERY_BUYER_DELIVERY_METHODS,
  },
  item: MOCK_PAYVIEW_ITEM,
  itemDetails: MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2,
  payment: {
    card: MOCK_CREDIT_CARD,
    methods: MOCK_PAYMENTS_PAYMENT_METHODS,
    preferences: MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
    wallet: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
  },
};

export const MOCK_PAYVIEW_STATE_WITHOUT_CREDIT_CARD: PayviewState = {
  costs: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  delivery: {
    address: MOCK_DELIVERY_ADDRESS,
    costs: MOCK_DELIVERY_COSTS_ITEM,
    methods: MOCK_DELIVERY_BUYER_DELIVERY_METHODS,
  },
  item: MOCK_PAYVIEW_ITEM,
  itemDetails: MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2,
  payment: {
    card: null,
    methods: MOCK_PAYMENTS_PAYMENT_METHODS,
    preferences: MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
    wallet: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
  },
};
export const MOCK_PAYVIEW_STATE_WITHOUT_LASTADDRESSUSED: PayviewState = {
  costs: MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  delivery: {
    address: MOCK_DELIVERY_ADDRESS,
    costs: MOCK_DELIVERY_COSTS_ITEM,
    methods: MOCK_DELIVERY_BUYER_DELIVERY_METHODS_WITHOUT_LASTADDRESSUSED,
  },
  item: MOCK_PAYVIEW_ITEM,
  itemDetails: MOCK_BUYER_REQUESTS_ITEMS_DETAILS_2,
  payment: {
    card: MOCK_CREDIT_CARD,
    methods: MOCK_PAYMENTS_PAYMENT_METHODS,
    preferences: MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
    wallet: MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY,
  },
};
