import { Money } from '@api/core/model/money.interface';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';

const MONEY_MOVEMENT_SVG_URL_BY_TYPE: Record<WALLET_HISTORY_MOVEMENT_TYPE, string> = {
  [WALLET_HISTORY_MOVEMENT_TYPE.IN]: 'assets/icons/money-in.svg',
  [WALLET_HISTORY_MOVEMENT_TYPE.OUT]: 'assets/icons/money-out.svg',
};

export const mapWalletBalanceHistoryDetailsToHistoricList = (input: WalletMovementHistoryDetail[], totalBalance: Money): HistoricList => {
  const result: HistoricList = { elements: [], totalBalance };

  input.forEach((balanceHistoryElement: WalletMovementHistoryDetail) => {
    const headerFromElement = getYearFromHistoryElement(balanceHistoryElement);
    const subtitleFromElement = getMonthFromHistoryElement(balanceHistoryElement);

    const headerNeedsToBeAdded = !result.elements?.find((y) => y.label === headerFromElement);
    if (headerNeedsToBeAdded) {
      result.elements.push({ label: headerFromElement, elements: [] });
    }

    const headerInResult = result.elements.find((y) => y.label === headerFromElement);
    const subtitleNeedsToBeAdded = !headerInResult.elements.find((m) => m.label === subtitleFromElement);
    if (subtitleNeedsToBeAdded) {
      headerInResult.elements.push({
        label: subtitleFromElement,
        elements: [mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement)],
      });
      return;
    }

    const subtitleInResult = headerInResult.elements.find((m) => m.label === subtitleFromElement);
    subtitleInResult.elements.push(mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement));
  });

  return result;
};

const getYearFromHistoryElement = (input: WalletMovementHistoryDetail): string => {
  return moment(input.date).format('YYYY');
};

const getMonthFromHistoryElement = (input: WalletMovementHistoryDetail): string => {
  return moment(input.date).format('MMMM');
};

const mapWalletBalanceHistoryElementToHistoricElement = (input: WalletMovementHistoryDetail): HistoricElement => {
  const { id, imageUrl, type, title, description, estimatedPayoutDescription: subDescription, moneyAmount } = input;
  const iconUrl = MONEY_MOVEMENT_SVG_URL_BY_TYPE[type];

  const historicElement: HistoricElement = {
    id,
    imageUrl,
    iconUrl,
    title,
    description,
    moneyAmount,
  };

  if (subDescription) {
    historicElement.subDescription = {
      text: subDescription,
      type: HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE.NORMAL,
    };
  }

  return historicElement;
};
