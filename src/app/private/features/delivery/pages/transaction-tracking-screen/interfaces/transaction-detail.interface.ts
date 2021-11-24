import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionDetail {
  description: string;
  iconSrc: string;
  showCaret: boolean;
  iconClassName: string;
  action: TransactionTrackingActionDetail | null;
}

// delete it when refactor sttus info
