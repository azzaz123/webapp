import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';

export interface PayviewPaymentEvent {
  payload: PaymentsPaymentMethod | null;
  type: PAYVIEW_PAYMENT_EVENT_TYPE;
}
