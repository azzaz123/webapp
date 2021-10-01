import { PaginatedList } from '../../lists';
import { Money } from '../../money.interface';
import { WalletMovementHistoryDetail } from './movement-history-detail';

export interface WalletMovementsHistoryList extends PaginatedList<WalletMovementHistoryDetail, number | null> {
  walletBalance: Money;
}
