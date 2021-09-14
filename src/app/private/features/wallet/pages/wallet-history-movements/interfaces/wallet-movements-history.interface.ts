import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { WalletMovementHistoryDate } from './wallet-movements-history-date.interface';

interface WalletMovementHistoryMonth extends WalletMovementHistoryDate<WalletMovementHistoryDetail> {}
interface WalletMovementHistoryYear extends WalletMovementHistoryDate<WalletMovementHistoryMonth> {}

export interface WalletMovementsHistory {
  years: WalletMovementHistoryYear[];
}
