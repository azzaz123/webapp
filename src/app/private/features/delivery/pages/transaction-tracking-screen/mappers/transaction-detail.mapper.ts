import { TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { FALLBACK_NOT_FOUND_SRC } from '@private/features/delivery/pages/transaction-tracking-screen/constants/fallback-src-images-constants';
import { TransactionDetail } from '../interfaces/transaction-detail.interface';

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
