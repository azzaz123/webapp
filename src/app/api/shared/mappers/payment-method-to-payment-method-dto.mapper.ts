import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentMethodToPaymentMethodDto: ToDomainMapper<PAYVIEW_PAYMENT_METHOD, PaymentMethodDto> = (
  paymentMethod: PAYVIEW_PAYMENT_METHOD
): PaymentMethodDto => {
  return PaymentMethodConverter[paymentMethod] ?? null;
};

const PaymentMethodConverter: Record<PAYVIEW_PAYMENT_METHOD, PaymentMethodDto> = {
  [PAYVIEW_PAYMENT_METHOD.CREDIT_CARD]: 'credit card',
  [PAYVIEW_PAYMENT_METHOD.PAYPAL]: 'paypal',
  [PAYVIEW_PAYMENT_METHOD.WALLET]: 'wallet',
  [PAYVIEW_PAYMENT_METHOD.WALLET_AND_CREDIT_CARD]: 'wallet, credit card',
  [PAYVIEW_PAYMENT_METHOD.WALLET_AND_PAYPAL]: 'wallet, paypal',
};
