import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentMethodDtoToPaymentMethod: ToDomainMapper<PaymentMethodDto, PAYVIEW_PAYMENT_METHOD> = (
  paymentMethodDto: PaymentMethodDto
): PAYVIEW_PAYMENT_METHOD => {
  return PaymentMethodConverterDto[paymentMethodDto] ?? null;
};

const PaymentMethodConverterDto: Record<PaymentMethodDto, PAYVIEW_PAYMENT_METHOD> = {
  'credit card': PAYVIEW_PAYMENT_METHOD.CREDIT_CARD,
  paypal: PAYVIEW_PAYMENT_METHOD.PAYPAL,
  wallet: PAYVIEW_PAYMENT_METHOD.WALLET,
  'wallet, credit card': PAYVIEW_PAYMENT_METHOD.WALLET_AND_CREDIT_CARD,
  'wallet, paypal': PAYVIEW_PAYMENT_METHOD.WALLET_AND_PAYPAL,
};
