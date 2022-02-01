import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentMethodDto } from '@api/shared/types/payment-method-dto.type';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentMethodDtoToPaymentMethod: ToDomainMapper<PaymentMethodDto, PaymentMethod> = (
  paymentMethodDto: PaymentMethodDto
): PaymentMethod => {
  return PaymentMethodConverterDto[paymentMethodDto] ?? null;
};

const PaymentMethodConverterDto: Record<PaymentMethodDto, PaymentMethod> = {
  'credit card': PaymentMethod.CREDIT_CARD,
  paypal: PaymentMethod.PAYPAL,
  wallet: PaymentMethod.WALLET,
  'wallet, credit card': PaymentMethod.WALLET_AND_CREDIT_CARD,
  'wallet, paypal': PaymentMethod.WALLET_AND_PAYPAL,
};
