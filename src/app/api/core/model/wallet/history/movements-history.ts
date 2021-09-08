import { WalletMovementHistoryDetail } from './movement-history-detail';

interface WalletMovementHistoryDate<T> {
  value: number;
  title: string;
  elements: T[];
}

interface WalletMovementHistoryMonth extends WalletMovementHistoryDate<WalletMovementHistoryDetail> {}
interface WalletMovementHistoryYear extends WalletMovementHistoryDate<WalletMovementHistoryMonth> {}

export interface WalletMovementsHistory {
  years: WalletMovementHistoryYear[];
}
