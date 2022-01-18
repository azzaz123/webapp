import { mapNumberAndCurrencyCodeToMoney, NumberCurrencyCode } from '@api/core/mappers';
import {
  mapDeliveryPendingTransactionState,
  mapDeliveryPendingTransactionStatusName,
  mapDeliveryPendingTransactionStatusTranslation,
} from '@api/core/mappers/delivery/deliveries/status';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { DeliveryPendingTransactionsAndRequests, Request } from '@api/core/model/delivery';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';
import { ToDomainMapper } from '@api/core/utils/types';
import {
  DeliveriesOngoingAsBuyerDto,
  DeliveriesOngoingAsSellerDto,
  DeliveryOngoingBuyerStatusDto,
  OngoingDeliveryAsBuyerDto,
  OngoingDeliveryAsSellerDto,
} from '../dtos';

export const mapDeliveriesAsBuyerToPendingTransactionsAndRequests: ToDomainMapper<
  DeliveriesOngoingAsBuyerDto,
  DeliveryPendingTransactionsAndRequests
> = (input: DeliveriesOngoingAsBuyerDto): DeliveryPendingTransactionsAndRequests => {
  if (!input) {
    return { transactions: [], requests: [] };
  }

  const deliveries: OngoingDeliveryAsBuyerDto[] = input.ongoing_deliveries;
  const transactions: DeliveryPendingTransaction[] = getMappedTransactions(deliveries, false);

  const requests: Request[] = getMappedRequests(deliveries, false);
  return {
    requests,
    transactions,
  };
};

export const mapDeliveriesAsSellerToPendingTransactionsAndRequests: ToDomainMapper<
  DeliveriesOngoingAsSellerDto,
  DeliveryPendingTransactionsAndRequests
> = (input: DeliveriesOngoingAsSellerDto): DeliveryPendingTransactionsAndRequests => {
  if (!input) {
    return { transactions: [], requests: [] };
  }

  const deliveries: OngoingDeliveryAsSellerDto[] = input.ongoing_deliveries;
  const transactions: DeliveryPendingTransaction[] = getMappedTransactions(deliveries, true);

  const requests: Request[] = getMappedRequests(deliveries, true);
  return {
    requests,
    transactions,
  };
};

function getMappedTransactions(
  deliveries: OngoingDeliveryAsSellerDto[] | OngoingDeliveryAsBuyerDto[],
  isCurrentUserTheSeller: boolean
): DeliveryPendingTransaction[] {
  return deliveries
    .filter((delivery) => delivery.status !== ('REQUEST_CREATED' as DeliveryOngoingBuyerStatusDto))
    .map((transactionDto: OngoingDeliveryAsSellerDto | OngoingDeliveryAsBuyerDto) =>
      mapEntityToDomain(transactionDto, isCurrentUserTheSeller)
    );
}

function getMappedRequests(
  deliveries: OngoingDeliveryAsSellerDto[] | OngoingDeliveryAsBuyerDto[],
  isCurrentUserTheSeller: boolean
): Request[] {
  return deliveries
    .filter((delivery) => delivery.status === ('REQUEST_CREATED' as DeliveryOngoingBuyerStatusDto))
    .map((requestDto: OngoingDeliveryAsBuyerDto) => mapEntityToDomain(requestDto, isCurrentUserTheSeller) as Request);
}

const mapEntityToDomain = (rawDelivery: OngoingDeliveryAsSellerDto | OngoingDeliveryAsBuyerDto, isCurrentUserTheSeller: boolean) => {
  const currencyCode: NumberCurrencyCode = {
    number: rawDelivery.item.cost.amount,
    currency: rawDelivery.item.cost.currency as CurrencyCode,
  };
  const statusName: DELIVERY_ONGOING_STATUS = mapDeliveryPendingTransactionStatusName(rawDelivery.status);

  const mappedTransaction: DeliveryPendingTransaction | Request = {
    id: rawDelivery.request_id,
    item: {
      id: rawDelivery.item.hash,
      imageUrl: rawDelivery.item.image,
      title: rawDelivery.item.name,
    },
    buyer: {
      id: rawDelivery.buyer.hash,
      imageUrl: rawDelivery.buyer.image,
      name: rawDelivery.buyer.name,
    },
    seller: {
      id: rawDelivery.seller.hash,
      imageUrl: rawDelivery.seller.image,
      name: rawDelivery.seller.name,
    },
    status: {
      name: statusName,
      translation: mapDeliveryPendingTransactionStatusTranslation(statusName, isCurrentUserTheSeller),
    },
    state: mapDeliveryPendingTransactionState(statusName),
    moneyAmount: mapNumberAndCurrencyCodeToMoney(currencyCode),
    isCurrentUserTheSeller,
  };
  return mappedTransaction;
};
