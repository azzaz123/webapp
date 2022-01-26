import { PaymentMethod } from '@api/shared/enums/payment-method.enum';
import { PaymentsPaymentMethod } from '@api/payments/payment-methods/interfaces/payments-payment-method.interface';
import { PaymentsPaymentMethodDto } from '@api/payments/payment-methods/dtos/payments-payment-method-dto.interface';
import { PaymentsPaymentMethods } from '@api/payments/payment-methods/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods: ToDomainMapper<PaymentsPaymentMethodsDto, PaymentsPaymentMethods> = (
  input: PaymentsPaymentMethodsDto
): PaymentsPaymentMethods => {
  const { payment_methods: paymentMethods } = input;

  return {
    paymentMethods: mapToPaymentsPaymentMethods(paymentMethods),
  };
};

export const mapToPaymentsPaymentMethod: ToDomainMapper<PaymentsPaymentMethodDto, PaymentsPaymentMethod> = (
  input: PaymentsPaymentMethodDto
): PaymentsPaymentMethod => {
  return {
    method: input.method as PaymentMethod,
  };
};

export const mapToPaymentsPaymentMethods: ToDomainMapper<PaymentsPaymentMethodDto[], PaymentsPaymentMethod[]> = (
  input: PaymentsPaymentMethodDto[]
): PaymentsPaymentMethod[] => {
  const result: PaymentsPaymentMethod[] = [];

  input.forEach((paymentMethod: PaymentsPaymentMethodDto) => {
    result.push(mapToPaymentsPaymentMethod(paymentMethod));
  });

  return result;
};
