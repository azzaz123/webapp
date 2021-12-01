import { TransactionTrackingActionDetail } from '@api/core/model/delivery/transaction/tracking';
import { COLORS } from '@core/colors/colors-constants';

export interface ConfirmationActionModalProperties {
  title?: string;
  description: string;
  confirmMessage: string;
  cancelMessage?: string;
  confirmColor: COLORS.WALLA_MAIN | COLORS.NEGATIVE_MAIN;
  positiveAction: TransactionTrackingActionDetail;
}
