import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { FALLBACK_NOT_FOUND_SRC } from '../constants/fallback-images-src-constants';
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
    iconSrc: statusInfo.icon?.url ?? FALLBACK_NOT_FOUND_SRC,
    showCaret: statusInfo.showCaret,
    iconClassName: statusInfo.icon.style.className,
    action: statusInfo.action,
  };
}
