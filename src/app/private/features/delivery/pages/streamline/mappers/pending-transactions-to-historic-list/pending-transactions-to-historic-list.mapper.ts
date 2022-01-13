import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';
import { Request } from '@api/core/model/delivery/request.interface';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricListHeader } from '@shared/historic-list/interfaces/historic-list-header.interface';
import { HistoricListSubtitle } from '@shared/historic-list/interfaces/historic-list-subtitle.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapOngoingTransactionTrackingStatusToSubDescriptionType } from './ongoing-transaction-tracking-status-to-subdescription-type.mapper';

export const mapPendingTransactionToHistoricList: ToDomainMapper<DeliveryPendingTransactionsAndRequests, HistoricList> = (
  input: DeliveryPendingTransactionsAndRequests
): HistoricList => {
  const historicListSubtitle: HistoricListSubtitle = mapPendingTransactionToHistoricListSubtitle(input);

  const isEmptyList = historicListSubtitle.elements.length === 0;
  if (isEmptyList) {
    const emptyList: HistoricList = {
      elements: [],
    };

    return emptyList;
  }

  const listHeader = mapPendingTransactionToHistoricListHeader(historicListSubtitle);
  return {
    elements: [listHeader],
  };
};

const mapPendingTransactionToHistoricListHeader = (input: HistoricListSubtitle): HistoricListHeader => {
  const isEmptyList = input.elements.length === 0;
  return isEmptyList ? { elements: [] } : { elements: [input] };
};

const mapPendingTransactionToHistoricListSubtitle = (input: DeliveryPendingTransactionsAndRequests): HistoricListSubtitle => {
  let historicElements: HistoricElement[] = [];
  const { requests, transactions } = input;
  const pendingRequests = requests.map(mapPendingRequestToHistoricElement);
  const pendingTransactions = transactions.map(mapPendingTransactionToHistoricElement);
  historicElements = historicElements.concat(pendingRequests);
  historicElements = historicElements.concat(pendingTransactions);
  const result: HistoricListSubtitle = { elements: historicElements };
  return result;
};

const mapPendingTransactionToHistoricElement = (pendingTransaction: DeliveryPendingTransaction): HistoricElement => {
  const { id, item, moneyAmount } = pendingTransaction;
  const description = getDescription();
  const subDescription = getSubDescription(pendingTransaction);
  const iconUrl = getIconUrl(pendingTransaction);

  const historicElement: HistoricElement = {
    id,
    imageUrl: item.imageUrl,
    iconUrl,
    title: item.title,
    description,
    moneyAmount,
    subDescription,
    payload: pendingTransaction,
  };

  return historicElement;
};

const mapPendingRequestToHistoricElement = (pendingRequest: Request): HistoricElement => {
  const { id, item, moneyAmount } = pendingRequest;
  const description = getDescription();
  const iconUrl = getIconUrl(pendingRequest);
  const subDescription = getSubDescription(pendingRequest);

  const historicElement: HistoricElement = {
    id,
    imageUrl: item.imageUrl,
    iconUrl,
    title: item.title,
    description,
    moneyAmount,
    subDescription,
    payload: pendingRequest,
  };

  return historicElement;
};

const getDescription = (): { text: string; iconUrl: string } => {
  return {
    text: $localize`:@@shipping_transaction_type_label:Via shipping`,
    iconUrl: 'assets/icons/box.svg',
  };
};

const getSubDescription = (
  input: DeliveryPendingTransaction | Request
): { text: string; type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } | null => {
  const type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE = mapOngoingTransactionTrackingStatusToSubDescriptionType[input.state];

  return {
    text: input.status.translation,
    type,
  };
};

const getIconUrl = (input: DeliveryPendingTransaction | Request): string => {
  const { buyer, seller, isCurrentUserTheSeller } = input;
  return isCurrentUserTheSeller ? buyer.imageUrl : seller.imageUrl;
};
