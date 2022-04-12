import { TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapTransactionTrackingDescriptionToIsPayPalPaymentMethod: ToDomainMapper<TransactionTrackingDetails, boolean> = (
  details: TransactionTrackingDetails
) => details.info[4]?.description.toUpperCase().includes('PAYPAL');
