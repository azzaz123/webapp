import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import {
  mapTransactionDeliveryStatusApiToModel,
  mapTransactionPaymentStatusApiToModel,
  mapTransactionStatusApiToModel,
} from '@api/core/mappers/delivery/status';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery/carrier-drop-off-mode.type';
import { PendingTransaction } from '@api/core/model/delivery/transaction';
import { TRANSACTION_STATUS } from '@api/core/model/delivery/transaction/status';
import { mapContextToOngoingTransactionTrackingStatus } from '@api/core/model/delivery/transaction/status/mappers/ongoing-transaction-tracking-status.mapper';
import { InnerType, ToDomainMapper } from '@api/core/utils/types';
import { RequestsAndTransactionsPendingDto } from '../../dtos/responses';

type TransactionPendingApi = InnerType<RequestsAndTransactionsPendingDto, 'transactions'>;
type TransactionPendingCarrierDropOffModeApi = TransactionPendingApi['carrier_drop_off_mode'];
type TransactionDtoResponseWithCurrentUserId = { dtoResponse: RequestsAndTransactionsPendingDto; currentUserId: string };

export const mapRequestsAndTransactionsPendingToPendingTransactions: ToDomainMapper<
  TransactionDtoResponseWithCurrentUserId,
  PendingTransaction[]
> = (input: TransactionDtoResponseWithCurrentUserId): PendingTransaction[] => {
  if (!input) {
    return [];
  }

  const { dtoResponse, currentUserId } = input;
  const { transactions } = dtoResponse;
  const mappedTransactions = [];

  transactions.forEach((rawTransaction: TransactionPendingApi) => {
    const {
      id,
      item_hash: itemId,
      item_image: itemImageUrl,
      item_name: itemTitle,
      item_cost: itemCost,
      buyer_user_hash: buyerId,
      buyer_user_image: buyerImageUrl,
      buyer_user_name: buyerName,
      seller_user_hash: sellerId,
      seller_user_image: sellerImageUrl,
      seller_user_name: sellerName,
      status,
      delivery_status,
      payment_status,
      carrier_drop_off_mode,
    } = rawTransaction;
    const { amount: number, currency } = itemCost;
    const typedCurrency = currency as CurrencyCode;
    const transactionStatus = mapTransactionStatusApiToModel(status);
    const deliveryStatus = mapTransactionDeliveryStatusApiToModel(delivery_status);
    const paymentStatus = mapTransactionPaymentStatusApiToModel(payment_status);
    const isCurrentUserTheSeller = currentUserId === sellerId;
    const trackingStatus = mapContextToOngoingTransactionTrackingStatus();
    const carrierDropOffMode = mapCarrierDropoffMode[carrier_drop_off_mode];

    const mappedTransaction: PendingTransaction = {
      id,
      item: {
        id: itemId,
        imageUrl: itemImageUrl,
        title: itemTitle,
      },
      buyer: {
        id: buyerId,
        imageUrl: buyerImageUrl,
        name: buyerName,
      },
      seller: {
        id: sellerId,
        imageUrl: sellerImageUrl,
        name: sellerName,
      },
      status: {
        transaction: transactionStatus as TRANSACTION_STATUS.PENDING,
        delivery: deliveryStatus,
        payment: paymentStatus,
        tracking: trackingStatus,
      },
      moneyAmount: mapNumberAndCurrencyCodeToMoney({ number, currency: typedCurrency }),
      isCurrentUserTheSeller,
      carrierDropOffMode,
    };
    mappedTransactions.push(mappedTransaction);
  });

  return mappedTransactions;
};

const mapCarrierDropoffMode: Record<TransactionPendingCarrierDropOffModeApi, CARRIER_DROP_OFF_MODE> = {
  POST_OFFICE: CARRIER_DROP_OFF_MODE.POST_OFFICE,
  HOME_PICKUP: CARRIER_DROP_OFF_MODE.HOME_PICK_UP,
};
