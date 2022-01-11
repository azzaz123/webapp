import { HistoricTransaction } from '@api/core/model';
import { ToDomainMapper } from '@api/core/utils/types';
import { completedTransactionTrackingStatusAsBuyerTranslations } from '@private/features/delivery/translations/completed-transaction-tracking-status-as-buyer.translations';
import { completedTransactionTrackingStatusAsSellerTranslations } from '@private/features/delivery/translations/completed-transaction-tracking-status-as-seller.translations';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';
import { mapCompletedTransactionTrackingStatusToSubDescription } from './completed-transaction-tracking-status-to-subdescription-type.mapper';

export const mapHistoricTransactionsToHistoricList: ToDomainMapper<HistoricTransaction[], HistoricList> = (
  input: HistoricTransaction[]
): HistoricList => {
  const result: HistoricList = { elements: [] };

  input.forEach((transaction: HistoricTransaction) => {
    const headerFromElement = getYearFromTransaction(transaction);
    const subtitleFromElement = getMonthFromTransaction(transaction);

    const headerNeedsToBeAdded = !result.elements?.find((y) => y.label === headerFromElement);
    if (headerNeedsToBeAdded) {
      result.elements.push({ label: headerFromElement, elements: [] });
    }

    const headerInResult = result.elements.find((y) => y.label === headerFromElement);
    const subtitleNeedsToBeAdded = !headerInResult.elements.find((m) => m.label === subtitleFromElement);
    if (subtitleNeedsToBeAdded) {
      headerInResult.elements.push({
        label: subtitleFromElement,
        elements: [mapTransactionToHistoricElement(transaction)],
      });
      return;
    }

    const subtitleInResult = headerInResult.elements.find((m) => m.label === subtitleFromElement);
    subtitleInResult.elements.push(mapTransactionToHistoricElement(transaction));
  });

  return result;
};

const getYearFromTransaction = (input: HistoricTransaction): string => {
  return moment(input.creationDate).format('YYYY');
};

const getMonthFromTransaction = (input: HistoricTransaction): string => {
  const formattedMonth = moment(input.creationDate).format('MMMM');
  const capitalizedFormattedMonth = `${formattedMonth[0].toUpperCase()}${formattedMonth.slice(1)}`;
  return capitalizedFormattedMonth;
};

const mapTransactionToHistoricElement = (input: HistoricTransaction): HistoricElement<HistoricTransaction> => {
  const { id, item, moneyAmount, requestId } = input;
  const { imageUrl, title } = item;
  const iconUrl = getIconUrlFromHistoricTransaction(input);
  const description = getDescriptionFromHistoricTransaction(input);
  const subDescription = getSubDescriptionFromHistoricTransaction(input);

  const historicElement: HistoricElement<HistoricTransaction> = {
    id,
    imageUrl,
    iconUrl,
    title,
    description,
    subDescription,
    moneyAmount,
    payload: input,
  };

  return historicElement;
};

const getIconUrlFromHistoricTransaction = (input: HistoricTransaction): string => {
  const { buyer, seller, isCurrentUserTheSeller } = input;
  return isCurrentUserTheSeller ? buyer.imageUrl : seller.imageUrl;
};

const getDescriptionFromHistoricTransaction = (input: HistoricTransaction): { text: string; iconUrl: string } => {
  return {
    text: $localize`:@@shipping_transaction_type_label:Via shipping`,
    iconUrl: 'assets/icons/box.svg',
  };
};

const getSubDescriptionFromHistoricTransaction = (
  input: HistoricTransaction
): { text: string; type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } => {
  const { creationDate, isCurrentUserTheSeller, status } = input;
  const { tracking: trackingStatus } = status;
  const formattedDate: string = moment(creationDate).format('DD MMM');
  const text: string = isCurrentUserTheSeller
    ? completedTransactionTrackingStatusAsSellerTranslations(trackingStatus, formattedDate)
    : completedTransactionTrackingStatusAsBuyerTranslations(trackingStatus, formattedDate);

  const type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE = mapCompletedTransactionTrackingStatusToSubDescription[trackingStatus];

  return {
    text,
    type,
  };
};
