import { ToDomainMapper } from '@api/core/utils/types';
import { WalletBalanceHistoryApi } from '../../dtos/responses';

interface WalletHistoricMovement {}

export const mapWalletBalanceHistoryApiToWalletMovements: ToDomainMapper<WalletBalanceHistoryApi, WalletHistoricMovement[]> = (
  input: WalletBalanceHistoryApi
): WalletHistoricMovement[] => {
  return [input];
};
