import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import {
  mapTransactionDeliveryStatusApiToModel,
  mapTransactionPaymentStatusApiToModel,
  mapTransactionStatusApiToModel,
} from '@api/core/mappers/delivery/status';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { PendingTransaction } from '@api/core/model/delivery/transaction';
import { TRANSACTION_STATUS } from '@api/core/model/delivery/transaction/status';
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
    const {
      id,
      item_hash: itemId,
      item_image: itemImageUrl,
      item_name: itemLabel,
      item_cost: itemCost,
      buyer_user_hash: buyerId,
      buyer_user_image: buyerImageUrl,
      buyer_user_name: buyerLabel,
      seller_user_hash: sellerId,
      seller_user_image: sellerImageUrl,
      seller_user_name: sellerLabel,
      status,
      delivery_status,
      payment_status,
    } = rawTransaction;
    const { amount: number, currency } = itemCost;
    const typedCurrency = currency as CurrencyCode;
    const transactionStatus = mapTransactionStatusApiToModel(status);
    const deliveryStatus = mapTransactionDeliveryStatusApiToModel(delivery_status);
    const paymentStatus = mapTransactionPaymentStatusApiToModel(payment_status);

    const mappedTransaction: PendingTransaction = {
      id,
      item: {
        id: itemId,
        imageUrl: itemImageUrl,
        label: itemLabel,
      },
      buyer: {
        id: buyerId,
        imageUrl: buyerImageUrl,
        label: buyerLabel,
      },
      seller: {
        id: sellerId,
        imageUrl: sellerImageUrl,
        label: sellerLabel,
      },
      status: {
        transaction: transactionStatus as TRANSACTION_STATUS.PENDING,
        delivery: deliveryStatus,
        payment: paymentStatus,
      },
      moneyAmount: mapNumberAndCurrencyCodeToMoney({ number, currency: typedCurrency }),
    };
    mappedTransactions.push(mappedTransaction);
  });

  return mappedTransactions;
};
