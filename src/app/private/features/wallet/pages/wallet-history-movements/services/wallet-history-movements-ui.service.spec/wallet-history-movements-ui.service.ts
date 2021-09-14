import { Injectable } from '@angular/core';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import * as moment from 'moment';
import { WalletMovementsHistory } from '../../interfaces/wallet-movements-history.interface';

@Injectable()
export class WalletHistoryMovementsUIService {
  public map(input: WalletMovementsHistoryList): WalletMovementsHistory {
    const result = { years: [] };
    const { list } = input;
    list.forEach((balanceHistoryElement: WalletMovementHistoryDetail) => {
      const yearFromElement = this.getYearFromHistoryElement(balanceHistoryElement);
      const monthFromElement = this.getMonthFromHistoryElement(balanceHistoryElement);

      const yearNeedsToBeAdded = !result.years?.find((y) => y.value === yearFromElement);
      if (yearNeedsToBeAdded) {
        result.years.push({ value: yearFromElement, title: yearFromElement.toString(), elements: [] });
      }

      const yearInResult = result.years.find((y) => y.value === yearFromElement);
      const monthNeedsToBeAdded = !yearInResult.elements.find((m) => m.value === monthFromElement);
      if (monthNeedsToBeAdded) {
        yearInResult.elements.push({
          value: monthFromElement,
          title: this.getMonthNameFromDate(balanceHistoryElement),
          elements: [balanceHistoryElement],
        });
        return;
      }

      const monthInResult = yearInResult.elements.find((m) => m.value === monthFromElement);
      monthInResult.elements.push(balanceHistoryElement);
    });

    return result;
  }

  private getYearFromHistoryElement(input: WalletMovementHistoryDetail): number {
    return moment(input.date).year();
  }

  private getMonthFromHistoryElement(input: WalletMovementHistoryDetail): number {
    return moment(input.date).month();
  }

  private getMonthNameFromDate(input: WalletMovementHistoryDetail): string {
    return moment(input.date).format('MMMM');
  }
}
