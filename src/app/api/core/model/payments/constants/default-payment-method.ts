import { PAYVIEW_PAYMENT_METHOD } from '../enums';
import { PaymentsPaymentMethod } from '../interfaces';

export const DEFAULT_PAYMENT_METHOD: PaymentsPaymentMethod = {
  method: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
};
