import { Money } from '@api/core/model/money.interface';
import { TransactionTrackingStatusInfoIcon } from '@api/core/model/delivery/transaction/tracking';

export interface TransactionTrackingDetailsItem {
  icon: TransactionTrackingStatusInfoIcon;
  price: Money;
  title: string;
}
