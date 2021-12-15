import { PendingTransaction } from '@api/core/model';
import { ToDomainMapper } from '@api/core/utils/types';
import { ongoingTransactionTrackingStatusAsBuyerTranslations } from '@private/features/delivery/translations/ongoing-transaction-tracking-status-as-buyer.translations';
import { ongoingTransactionTrackingStatusAsSellerTranslations } from '@private/features/delivery/translations/ongoing-transaction-tracking-status-as-seller.translations';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricListHeader } from '@shared/historic-list/interfaces/historic-list-header.interface';
import { HistoricListSubtitle } from '@shared/historic-list/interfaces/historic-list-subtitle.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { mapOngoingTransactionTrackingStatusToSubDescriptionType } from './ongoing-transaction-tracking-status-to-subdescription-type.mapper';

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

    historicElements.push(historicElement);
  });

  const result: HistoricListSubtitle = { elements: historicElements };
  return result;
};

const getDescription = (): { text: string; iconUrl: string } => {
  return {
    text: $localize`:@@shipping_transaction_type_label:Via shipping`,
    iconUrl: 'assets/icons/box.svg',
  };
};

const getSubDescription = (input: PendingTransaction): { text: string; type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } | null => {
  const { status, isCurrentUserTheSeller } = input;
  const { tracking: trackingStatus } = status;
  const text: string = isCurrentUserTheSeller
    ? ongoingTransactionTrackingStatusAsSellerTranslations[trackingStatus]
    : ongoingTransactionTrackingStatusAsBuyerTranslations[trackingStatus];

  const type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE = mapOngoingTransactionTrackingStatusToSubDescriptionType[trackingStatus];

  // TODO: Review when streamline is implemented
  const isStreamlineActive = false;

  if (isStreamlineActive) {
    return {
      text,
      type,
    };
  }

  return null;
};

const getIconUrl = (input: PendingTransaction): string => {
  const { buyer, seller, isCurrentUserTheSeller } = input;
  return isCurrentUserTheSeller ? buyer.imageUrl : seller.imageUrl;
};
