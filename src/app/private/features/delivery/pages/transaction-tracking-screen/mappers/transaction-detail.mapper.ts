import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionDetail } from '../interfaces/transaction-detail.interface';

export function mapTransactionsDetail(statusInfo: TransactionTrackingStatusInfo[]): TransactionDetail[] {
  const propertiesMapped: TransactionDetail[] = [];
  statusInfo.forEach((slot: TransactionTrackingStatusInfo) => {
    propertiesMapped.push(mapTransactionDetail(slot));
  });
  return propertiesMapped;
}

export function mapTransactionDetail(statusInfo: TransactionTrackingStatusInfo): TransactionDetail {
  return {
    description: statusInfo.description,
    iconSrc: statusInfo.icon.url,
    showCaret: statusInfo.showCaret,
    iconClassName: statusInfo.icon.style.className,
  };
}
