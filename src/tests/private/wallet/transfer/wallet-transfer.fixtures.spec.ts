import { Currency } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { NumericAmount } from '@api/core/model/numeric-amount.interface';
import { WalletTransferRequestInterface } from '@private/features/wallet/interfaces/transfer/wallet-transfer-request.interface';

export const MOCK_CURRENCY_TO_TRANSFER: Currency = {
  code: 'EUR',
  symbol: '€',
};

export const MOCK_NUMERIC_AMOUNT_TO_TRANSFER: NumericAmount = {
  integer: 13,
  decimals: 99,
  total: 13.99,
};

export const MOCK_MONEY_TO_TRANSFER: Money = {
  amount: MOCK_NUMERIC_AMOUNT_TO_TRANSFER,
  currency: MOCK_CURRENCY_TO_TRANSFER,
};

export const MOCK_API_REQUEST_TO_TRANSFER: WalletTransferRequestInterface = {
  id: 'fake id',
  pay_out_id: 'fake id too',
  funds: {
    amount: 13.99,
    currency: 'EUR',
  },
};
