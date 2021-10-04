import { Injectable } from '@angular/core';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';

const MONEY_MOVEMENT_SVG_URL_BY_TYPE: Record<WALLET_HISTORY_MOVEMENT_TYPE, string> = {
  [WALLET_HISTORY_MOVEMENT_TYPE.IN]: 'assets/icons/money-in.svg',
  [WALLET_HISTORY_MOVEMENT_TYPE.OUT]: 'assets/icons/money-out.svg',
};

@Injectable()
export class WalletHistoryMovementsUIService {
  public mapToHistoricList(input: WalletMovementHistoryDetail[]): HistoricList {
    const result: HistoricList = { elements: [] };

    input.forEach((balanceHistoryElement: WalletMovementHistoryDetail) => {
      const headerFromElement = this.getYearFromHistoryElement(balanceHistoryElement);
      const subtitleFromElement = this.getMonthFromHistoryElement(balanceHistoryElement);

      const headerNeedsToBeAdded = !result.elements?.find((y) => y.label === headerFromElement);
      if (headerNeedsToBeAdded) {
        result.elements.push({ label: headerFromElement, elements: [] });
      }

      const headerInResult = result.elements.find((y) => y.label === headerFromElement);
      const subtitleNeedsToBeAdded = !headerInResult.elements.find((m) => m.label === subtitleFromElement);
      if (subtitleNeedsToBeAdded) {
        headerInResult.elements.push({
          label: subtitleFromElement,
          elements: [this.mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement)],
        });
        return;
      }

      const subtitleInResult = headerInResult.elements.find((m) => m.label === subtitleFromElement);
      subtitleInResult.elements.push(this.mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement));
    });

    return result;
  }

  private getYearFromHistoryElement(input: WalletMovementHistoryDetail): string {
    return moment(input.date).format('YYYY');
  }

  private getMonthFromHistoryElement(input: WalletMovementHistoryDetail): string {
    return moment(input.date).format('MMMM');
  }

  private mapWalletBalanceHistoryElementToHistoricElement(input: WalletMovementHistoryDetail): HistoricElement {
    const { imageUrl: itemImageUrl, type, title, description, estimatedPayoutDescription: subDescription, date, moneyAmmount } = input;
    const iconUrl = MONEY_MOVEMENT_SVG_URL_BY_TYPE[type];

    return {
      itemImageUrl,
      iconUrl,
      title,
      description,
      subDescription,
      date,
      moneyAmmount,
    };
  }
}
