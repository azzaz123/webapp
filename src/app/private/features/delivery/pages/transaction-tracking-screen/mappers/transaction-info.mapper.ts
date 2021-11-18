import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import {
  FALLBACK_ITEM_IMAGE_SRC,
  FALLBACK_USER_IMAGE_SRC,
} from '@private/features/delivery/pages/transaction-tracking-screen/constants/fallback-src-images-constants';
import { TransactionInfo } from '../interfaces/transaction-info.interface';

export function mapTransactionTrackingDetailsToInfo(transactionTrackingDetails: TransactionTrackingDetails): TransactionInfo {
  return {
    user: {
      imageSrc: transactionTrackingDetails.user.icon.url ?? FALLBACK_USER_IMAGE_SRC,
      className: transactionTrackingDetails.user.icon.style.className,
    },
    item: {
      imageSrc: transactionTrackingDetails.item.icon.url ?? FALLBACK_ITEM_IMAGE_SRC,
      className: transactionTrackingDetails.item.icon.style.className,
      name: transactionTrackingDetails.item.title,
      price: `${transactionTrackingDetails.item.price.amount.total}${transactionTrackingDetails.item.price.currency.symbol}`,
    },
  };
}
