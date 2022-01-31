import { mapPaymentMethodDtoToPaymentMethod } from '@api/shared/mappers/payment-method-dto-to-payment-method.mapper';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PaymentsPaymentMethodDto } from '@api/payments/payment-methods/dtos/payments-payment-method-dto.interface';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
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
    method: mapPaymentMethodDtoToPaymentMethod(input.method),
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
