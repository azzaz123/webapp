import { WalletMovementHistoryDetail } from './movement-history-detail';

export interface WalletMovementsHistory {
  years: [
    {
      months: WalletMovementHistoryDetail[];
    }
  ];
}
