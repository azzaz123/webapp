import { mapCurrencyCodeToCurrency } from '@api/core/mappers/currency-mapper';
import { mapNumberToNumericAmount } from '@api/core/mappers/numeric-amount-mapper';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { PaymentsWalletsApi } from '../../dtos/responses/payments-wallets-api.interface';

export const mapPaymentsWalletsApiToMoney: ToDomainMapper<PaymentsWalletsApi, Money> = (input: PaymentsWalletsApi): Money => {
  const { amount, currency: currencyCode } = input;

  return {
    amount: mapNumberToNumericAmount(amount),
    currency: mapCurrencyCodeToCurrency(currencyCode),
  };
};
