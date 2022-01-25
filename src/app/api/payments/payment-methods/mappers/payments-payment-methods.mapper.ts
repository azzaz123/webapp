import { PaymentsPaymentMethods } from '@api/payments/payment-methods/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods: ToDomainMapper<PaymentsPaymentMethodsDto, PaymentsPaymentMethods> = (
  input: PaymentsPaymentMethodsDto
): PaymentsPaymentMethods => {
  const { payment_methods: paymentMethods } = input;

  return {
    paymentMethods: paymentMethods,
  };
};
