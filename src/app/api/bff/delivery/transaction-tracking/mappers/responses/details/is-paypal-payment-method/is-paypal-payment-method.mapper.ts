import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapTransactionTrackingDescriptionToIsPayPalPaymentMethod: ToDomainMapper<TransactionTrackingDetails, boolean> = (
  details: TransactionTrackingDetails
) => details.info.some((element) => element.description.toUpperCase().includes('PAYPAL'));
