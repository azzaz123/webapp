import { HistoricTransaction } from '@api/core/model';
import { ToDomainMapper } from '@api/core/utils/types';
import { deliveryStatusTranslationsAsBuyer } from '@private/features/delivery/translations/delivery-status-as-buyer.translations';
import { deliveryStatusTranslationsAsSeller } from '@private/features/delivery/translations/delivery-status-as-seller.translations';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';
import { mapTransactionStatusToSubDescriptionType } from '../transaction-status-to-subdescription-type.mapper';

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
  return moment(input.creationDate).format('MMMM');
};

const mapTransactionToHistoricElement = (input: HistoricTransaction): HistoricElement => {
  const { id, item, moneyAmount } = input;
  const { imageUrl, title } = item;
  const iconUrl = getIconUrlFromHistoricTransaction(input);
  const description = getDescriptionFromHistoricTransaction(input);
  const subDescription = getSubDescriptionFromHistoricTransaction(input);

  const historicElement: HistoricElement = {
    id,
    imageUrl,
    iconUrl,
    title,
    description,
    subDescription,
    moneyAmount,
  };

  return historicElement;
};

// TODO: Move to domain
const isCurrentUserTheSeller = (input: HistoricTransaction): boolean => {
  return true;
};

const getIconUrlFromHistoricTransaction = (input: HistoricTransaction): string => {
  const isSeller = isCurrentUserTheSeller(input);
  return isSeller ? input.buyer.imageUrl : input.seller.imageUrl;
};

const getDescriptionFromHistoricTransaction = (input: HistoricTransaction): { text: string; iconUrl: string } => {
  return {
    text: 'Via shipping',
    iconUrl: 'assets/icons/box.svg',
  };
};

const getSubDescriptionFromHistoricTransaction = (
  input: HistoricTransaction
): { text: string; type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } => {
  const formattedDate: string = moment(input.creationDate).format('DD MMM');
  const text: string = `Completed on ${formattedDate}`;

  const type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE = HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL;

  return {
    text,
    type,
  };
};
