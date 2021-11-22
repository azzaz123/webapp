import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { TransactionDetail } from '../interfaces/transaction-detail.interface';

export const FALLBACK_NOT_FOUND_SRC = '/assets/images/delivery/transactional-tracking-screen/not_found.jpg';

export function mapTransactionsDetail(statusInfo: TransactionTrackingStatusInfo[]): TransactionDetail[] {
  const propertiesMapped: TransactionDetail[] = [];
  statusInfo.forEach((slot: TransactionTrackingStatusInfo) => {
    propertiesMapped.push(mapTransactionDetail(slot));
  });
  return propertiesMapped;
}

export function mapTransactionDetail(statusInfo: TransactionTrackingStatusInfo): TransactionDetail {
  // preguntar thumbnailUrl
  return {
    description: statusInfo.description,
    iconSrc: statusInfo.icon?.url ?? FALLBACK_NOT_FOUND_SRC,
    showCaret: statusInfo.showCaret,
    iconClassName: statusInfo.icon.style.className,
  };
}
