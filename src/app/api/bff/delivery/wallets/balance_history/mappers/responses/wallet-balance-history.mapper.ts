import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';
import { WalletMovementsHistoryList } from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import { InnerType, ToDomainMapper } from '@api/core/utils/types';
import * as moment from 'moment';
import { WalletBalanceHistoryApi } from '../../dtos/responses';

type BalanceHistoryElementApi = InnerType<WalletBalanceHistoryApi, 'balance_history'>;
type BalanceHistoryMovementType = InnerType<BalanceHistoryElementApi, 'type'>;

const LOCALIZED_MOVEMENT_TYPE: Record<BalanceHistoryMovementType, string> = {
  TRANSFER_IN: $localize`:@@movements_history_all_users_movement_details_sale_label:Sale`,
  TRANSFER_REFUND: $localize`:@@movements_history_all_users_movement_details_refund_label:Refund`,
  TRANSFER_OUT: $localize`:@@movements_history_all_users_movement_details_purchase_label:Purchase`,
  TRANSFER_TO_BANK: $localize`:@@movements_history_all_users_movement_details_cashout_label:Withdrawal`,
};

const mapTransferTypeToDomain: Record<BalanceHistoryMovementType, WALLET_HISTORY_MOVEMENT_TYPE> = {
  TRANSFER_IN: WALLET_HISTORY_MOVEMENT_TYPE.IN,
  TRANSFER_REFUND: WALLET_HISTORY_MOVEMENT_TYPE.IN,
  TRANSFER_TO_BANK: WALLET_HISTORY_MOVEMENT_TYPE.OUT,
  TRANSFER_OUT: WALLET_HISTORY_MOVEMENT_TYPE.OUT,
};

export const mapWalletBalanceHistoryApiToWalletMovements: ToDomainMapper<WalletBalanceHistoryApi, WalletMovementsHistoryList> = (
  input: WalletBalanceHistoryApi
): WalletMovementsHistoryList => {
  const { wallet_balance_amount: number, wallet_balance_currency: currency, next_page: paginationParameter, balance_history } = input;
  const walletBalance = mapNumberAndCurrencyCodeToMoney({ number, currency });
  const list = balance_history.map(mapBalanceHistoryElementToDetail);

  return { list, paginationParameter, walletBalance };
};

const getTitleFromHistoryElement = (input: BalanceHistoryElementApi): string => {
  const { item, bank_account } = input;
  const regexpToGetAllXs = /(\X)+/g;
  return item?.title || bank_account?.replace(regexpToGetAllXs, '••••');
};

const getDescriptionFromHistoryElement = (historyElement: BalanceHistoryElementApi): string => {
  const { type, created_at } = historyElement;
  return `${LOCALIZED_MOVEMENT_TYPE[type]} · ${moment(created_at).format('D MMM')}`;
};

const mapBalanceHistoryElementToDetail = (input: BalanceHistoryElementApi): WalletMovementHistoryDetail => {
  const { item, amount, created_at, currency, type } = input;
  const imageUrl = item?.picture_url ?? 'assets/images/bank.svg';

  const mappedType = mapTransferTypeToDomain[type];
  const title = getTitleFromHistoryElement(input);
  const description = getDescriptionFromHistoryElement(input);
  const date = new Date(created_at);
  const numberSign = mappedType === WALLET_HISTORY_MOVEMENT_TYPE.IN ? 1 : -1;
  const moneyAmmount = mapNumberAndCurrencyCodeToMoney({ number: numberSign * amount, currency });

  return {
    imageUrl,
    type: mappedType,
    title,
    description,
    date,
    moneyAmmount,
  };
};
