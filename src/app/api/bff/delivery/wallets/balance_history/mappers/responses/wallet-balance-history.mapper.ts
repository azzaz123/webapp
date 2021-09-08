import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';
import { WalletMovementsHistory } from '@api/core/model/wallet/history/movements-history';
import { InnerType, ToDomainMapper } from '@api/core/utils/types';
import * as moment from 'moment';
import { WalletBalanceHistoryApi } from '../../dtos/responses';

type BalanceHistoryElementApi = InnerType<WalletBalanceHistoryApi, 'balance_history'>;
type BalanceHistoryMovementType = InnerType<BalanceHistoryElementApi, 'type'>;
const LOCALIZED_MOVEMENT_TYPE: Record<BalanceHistoryMovementType, string> = {
  TRANSFER_IN: $localize`:@@movements_history_all_users_movement_details_sale_label:Sale`,
  TRANSFER_OUT: $localize`:@@movements_history_all_users_movement_details_purchase_label:Purchase`,
  TRANSFER_TO_BANK: $localize`:@@movements_history_all_users_movement_details_cashout_label:Withdrawal`,
};

export const mapWalletBalanceHistoryApiToWalletMovements: ToDomainMapper<WalletBalanceHistoryApi, WalletMovementsHistory> = (
  input: WalletBalanceHistoryApi
): WalletMovementsHistory => {
  return generateMovementsHistoryFromApi(input);
};

const generateMovementsHistoryFromApi = (input: WalletBalanceHistoryApi): WalletMovementsHistory => {
  const result: WalletMovementsHistory = { years: [] };

  const { balance_history } = input;
  balance_history.forEach((balanceHistoryElement) => {
    const yearFromElement = getYearFromHistoryElement(balanceHistoryElement);
    const monthFromElement = getMonthFromHistoryElement(balanceHistoryElement);

    const yearNeedsToBeAdded = !result.years?.find((y) => y.value === yearFromElement);
    if (yearNeedsToBeAdded) {
      result.years.push({ value: yearFromElement, title: yearFromElement.toString(), elements: [] });
    }

    const yearInResult = result.years.find((y) => y.value === yearFromElement);
    const monthNeedsToBeAdded = !yearInResult.elements.find((m) => m.value === monthFromElement);
    if (monthNeedsToBeAdded) {
      yearInResult.elements.push({
        value: monthFromElement,
        title: getMonthNameFromDate(balanceHistoryElement),
        elements: [mapBalanceHistoryElementToDetail(balanceHistoryElement)],
      });
      return;
    }

    const monthInResult = yearInResult.elements.find((m) => m.value === monthFromElement);
    monthInResult.elements.push(mapBalanceHistoryElementToDetail(balanceHistoryElement));
  });

  return result;
};

const getYearFromHistoryElement = (input: BalanceHistoryElementApi): number => {
  return moment(input.created_at).year();
};

const getMonthFromHistoryElement = (input: BalanceHistoryElementApi): number => {
  return moment(input.created_at).month();
};

const getMonthNameFromDate = (input: BalanceHistoryElementApi): string => {
  return moment(input.created_at).format('MMMM');
};

const getDescriptionFromHistoryElement = (historyElement: BalanceHistoryElementApi): string => {
  const { type, created_at } = historyElement;
  return `${LOCALIZED_MOVEMENT_TYPE[type]} · ${moment(created_at).format('D MMM')}`;
};

const mapBalanceHistoryElementToDetail = (input: BalanceHistoryElementApi): WalletMovementHistoryDetail => {
  const { item, amount, bank_account, created_at, currency, type } = input;
  const imageUrl = item?.picture_url ?? 'assets/images/bank.svg';

  const mappedType = type === 'TRANSFER_IN' ? WALLET_HISTORY_MOVEMENT_TYPE.IN : WALLET_HISTORY_MOVEMENT_TYPE.OUT;
  const title = item?.title || bank_account;
  const description = getDescriptionFromHistoryElement(input);
  const date = new Date(created_at);
  const moneyAmmount = mapNumberAndCurrencyCodeToMoney({ number: amount, currency });

  return {
    imageUrl,
    type: mappedType,
    description,
    title,
    date,
    moneyAmmount,
  };
};
