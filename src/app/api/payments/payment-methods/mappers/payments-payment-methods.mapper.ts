import { mapPaymentMethodDtoToPaymentMethod } from '@api/shared/mappers/payment-method-dto-to-payment-method.mapper';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PaymentsPaymentMethodDto } from '@api/payments/payment-methods/dtos/payments-payment-method-dto.interface';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import { AVAILABLE_PAYMENT_METHODS } from '@api/core/model/payments/constants/available-payments';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { DEFAULT_PAYMENT_METHOD } from '@api/core/model/payments/constants/default-payment-method';

export const mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods: ToDomainMapper<PaymentsPaymentMethodsDto, PaymentsPaymentMethods> = (
  input: PaymentsPaymentMethodsDto
): PaymentsPaymentMethods => {
  const { payment_methods } = input;

  const paymentMethods: PaymentsPaymentMethod[] = mapToPaymentsPaymentMethods(payment_methods);
  return {
    paymentMethods,
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
    const payviewPaymentMethod: PAYVIEW_PAYMENT_METHOD = mapPaymentMethodDtoToPaymentMethod(paymentMethod.method);
    if (AVAILABLE_PAYMENT_METHODS.includes(payviewPaymentMethod)) {
      result.push(mapToPaymentsPaymentMethod(paymentMethod));
    }
  });

  if (result.length === 0) {
    result.push(DEFAULT_PAYMENT_METHOD);
  }

  return result;
};
