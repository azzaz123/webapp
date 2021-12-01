import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';

export interface ConfirmationActionModalProperties extends ConfirmationModalProperties {
  positiveAction: TransactionTrackingActionDetail;
}
