import { Currency } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { NumericAmount } from '@api/core/model/numeric-amount.interface';
import { WalletTransferMoneyInterface } from '@private/features/wallet/modals/transfer/interfaces/wallet-transfer-money.interface';
import { WalletTransferRequest } from '@private/features/wallet/interfaces/transfer/wallet-transfer-request.interface';

export const MOCK_BALANCE_CURRENCY: Currency = {
  code: 'EUR',
  symbol: '€',
};

export const MOCK_BALANCE_NUMERIC_AMOUNT: NumericAmount = {
  integer: 1234,
  decimals: 56,
  total: 1234.56,
};

export const MOCK_BALANCE: Money = {
  amount: MOCK_BALANCE_NUMERIC_AMOUNT,
  currency: MOCK_BALANCE_CURRENCY,
};

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

export const MOCK_TRANSFER_AMOUNT: WalletTransferMoneyInterface = {
  balance: MOCK_BALANCE,
  amount: MOCK_NUMERIC_AMOUNT_TO_TRANSFER,
  currency: MOCK_CURRENCY_TO_TRANSFER,
};

export const MOCK_API_REQUEST_TO_TRANSFER: WalletTransferRequest = {
  id: 'fake id',
  pay_out_id: 'fake id too',
  funds: {
    amount: 13.99,
    currency: 'EUR',
  },
};
