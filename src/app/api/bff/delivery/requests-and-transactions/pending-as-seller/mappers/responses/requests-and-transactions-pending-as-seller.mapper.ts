import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { PendingTransaction } from '@api/core/model/wallet/transaction';
import { InnerType, ToDomainMapper } from '@api/core/utils/types';
import { RequestsAndTransactionsPendingAsSellerApi } from '../../dtos/responses';

type TransactionPendingAsSellerApi = InnerType<RequestsAndTransactionsPendingAsSellerApi, 'transactions'>;

export const mapRequestsAndTransactionsPendingAsSellerToPendingBalance: ToDomainMapper<
  RequestsAndTransactionsPendingAsSellerApi,
  PendingTransaction[]
> = (input: RequestsAndTransactionsPendingAsSellerApi): PendingTransaction[] => {
  if (!input) {
    return [];
  }

  const { transactions } = input;
  const mappedTransactions = [];

  transactions.forEach((rawTransaction: TransactionPendingAsSellerApi) => {
    const { item_hash: itemHash, item_image: itemImageUrl, item_name: itemTitle, item_cost: itemCost } = rawTransaction;
    const { amount: number, currency } = itemCost;
    const typedCurrency = currency as CurrencyCode;

    const mappedTransaction: PendingTransaction = {
      itemHash,
      itemImageUrl,
      itemTitle,
      moneyAmount: mapNumberAndCurrencyCodeToMoney({ number, currency: typedCurrency }),
    };
    mappedTransactions.push(mappedTransaction);
  });

  return mappedTransactions;
};
