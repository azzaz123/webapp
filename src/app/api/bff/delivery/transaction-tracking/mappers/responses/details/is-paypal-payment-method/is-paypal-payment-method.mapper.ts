import { TransactionTrackingDetails, TransactionTrackingStatusInfo } from '@api/core/model/delivery/transaction/tracking';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapTransactionTrackingDescriptionToIsPayPalPaymentMethod: ToDomainMapper<TransactionTrackingDetails, boolean> = (
  details: TransactionTrackingDetails
) => details.info.some((element: TransactionTrackingStatusInfo) => element.description.toUpperCase().includes('PAYPAL'));
