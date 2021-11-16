import { HistoricTransaction } from '@api/core/model';
import { ToDomainMapper } from '@api/core/utils/types';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';

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
  const description: string = 'Completed';

  const historicElement: HistoricElement = {
    id,
    imageUrl,
    title,
    description,
    moneyAmount,
  };

  return historicElement;
};
