import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentMethodToPaymentMethodDto: ToDomainMapper<PaymentMethod, PaymentMethodDto> = (
  paymentMethod: PaymentMethod
): PaymentMethodDto => {
  return PaymentMethodConverter[paymentMethod] ?? null;
};

const PaymentMethodConverter: Record<PaymentMethod, PaymentMethodDto> = {
  [PaymentMethod.CREDIT_CARD]: 'credit card',
  [PaymentMethod.PAYPAL]: 'paypal',
  [PaymentMethod.WALLET]: 'wallet',
  [PaymentMethod.WALLET_AND_CREDIT_CARD]: 'wallet, credit card',
  [PaymentMethod.WALLET_AND_PAYPAL]: 'wallet, paypal',
};
