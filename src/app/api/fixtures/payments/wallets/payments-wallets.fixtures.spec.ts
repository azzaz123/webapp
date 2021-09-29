import { Money } from '@api/core/model/money.interface';
import { PaymentsWalletsApi } from '@api/payments/wallets/dtos/responses';
import { Observable, of } from 'rxjs';

export const MOCK_PAYMENTS_WALLETS_RESPONSE: PaymentsWalletsApi = {
  amount: 3,
  currency: 'EUR',
  id: 'da3c9db6-2cce-496a-9386-c3a43ce7366a',
};

export const MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_RESPONSE: PaymentsWalletsApi = {
  amount: 1722.41,
  currency: 'EUR',
  id: '92020cb7-f320-47f3-8bbe-d1cbf0d6a205',
};

export const MOCK_PAYMENTS_WALLET_MAPPED_WITHOUT_MONEY: Money = {
  amount: {
    integer: 0,
    decimals: 0,
    total: 0,
    toString: () => parseFloat('0').toFixed(2).toLocaleString(),
  },
  currency: {
    code: 'EUR',
    symbol: '€',
  },
};

export const MOCK_PAYMENTS_WALLETS_MAPPED_MONEY: Money = {
  amount: {
    integer: 3,
    decimals: 0,
    total: 3,
    toString: () => parseFloat('3').toFixed(2).toLocaleString(),
  },
  currency: {
    code: 'EUR',
    symbol: '€',
  },
};

export const MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY: Money = {
  amount: {
    integer: 1722,
    decimals: 41,
    total: 1722.41,
    toString: () => '',
  },
  currency: {
    code: 'EUR',
    symbol: '€',
  },
};

export class MockPaymentsWalletsService {
  public get walletBalance$(): Observable<Money> {
    return of(MOCK_PAYMENTS_WALLETS_WITH_DECIMALS_MAPPED_MONEY);
  }
}
