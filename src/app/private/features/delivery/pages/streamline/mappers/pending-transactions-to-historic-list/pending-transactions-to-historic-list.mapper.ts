import { PendingTransaction } from '@api/core/model';
import { ToDomainMapper } from '@api/core/utils/types';
import { deliveryStatusTranslationsAsBuyer } from '@private/features/delivery/translations/delivery-status-as-buyer.translations';
import { deliveryStatusTranslationsAsSeller } from '@private/features/delivery/translations/delivery-status-as-seller.translations';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricListHeader } from '@shared/historic-list/interfaces/historic-list-header.interface';
import { HistoricListSubtitle } from '@shared/historic-list/interfaces/historic-list-subtitle.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';

export const mapPendingTransactionToHistoricList: ToDomainMapper<PendingTransaction[], HistoricList> = (
  input: PendingTransaction[]
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

const mapPendingTransactionToHistoricListSubtitle = (input: PendingTransaction[]): HistoricListSubtitle => {
  const historicElements: HistoricElement[] = [];

  input.forEach((pendingTransaction: PendingTransaction) => {
    const { id, item, moneyAmount } = pendingTransaction;
    const description = getTranslatedDescription(pendingTransaction);

    const historicElement: HistoricElement = {
      id,
      imageUrl: item.imageUrl,
      title: item.title,
      description,
      moneyAmount,
    };

    historicElements.push(historicElement);
  });

  const result: HistoricListSubtitle = { elements: historicElements };
  return result;
};

const getTranslatedDescription = (input: PendingTransaction): string => {
  const { status, seller } = input;
  const { delivery: deliveryStatus } = status;
  let result: string = '';

  // TODO: seller.id === user.id
  const isSeller = true;
  result = isSeller ? deliveryStatusTranslationsAsSeller[deliveryStatus] : deliveryStatusTranslationsAsBuyer[deliveryStatus];
  return result;
};
