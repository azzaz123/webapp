import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingInfo } from '../interfaces/transaction-tracking-info.interface';

export function mapTransactionsTrackingInfo(statusInfo: TransactionTrackingStatusInfo[]): TransactionTrackingInfo[] {
  const propertiesMapped: TransactionTrackingInfo[] = [];
  statusInfo.forEach((slot: TransactionTrackingStatusInfo) => {
    propertiesMapped.push(mapTransactionTrackingInfo(slot));
  });
  return propertiesMapped;
}

export function mapTransactionTrackingInfo(statusInfo: TransactionTrackingStatusInfo): TransactionTrackingInfo {
  return {
    description: statusInfo.description,
    iconSrc: statusInfo.icon.url,
    showCaret: statusInfo.showCaret,
    iconClassName: statusInfo.icon.style.className,
  };
}
