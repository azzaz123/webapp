import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';

export const MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE: PaymentsPaymentMethodsDto = {
  payment_methods: [{ method: 'paypal' }, { method: 'credit card' }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS: PaymentsPaymentMethods = {
  paymentMethods: [{ method: 'paypal' as PaymentMethod }, { method: 'credit card' as PaymentMethod }],
};
