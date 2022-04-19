import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';

export const MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE: PaymentsPaymentMethodsDto = {
  payment_methods: [{ method: 'paypal' }, { method: 'credit card' }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS: PaymentsPaymentMethods = {
  paymentMethods: [{ method: PAYVIEW_PAYMENT_METHOD.PAYPAL }, { method: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_NON_AVAILABLE_METHODS: PaymentsPaymentMethodsDto = {
  payment_methods: [{ method: 'wallet' }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_AVAILABLE_METHODS: PaymentsPaymentMethodsDto = {
  payment_methods: [{ method: 'credit card' }, { method: 'paypal' }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ONLY_CREDIT_CARD: PaymentsPaymentMethods = {
  paymentMethods: [{ method: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD }],
};

export const MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ALL_PAYMENT_METHODS: PaymentsPaymentMethods = {
  paymentMethods: [{ method: PAYVIEW_PAYMENT_METHOD.CREDIT_CARD }, { method: PAYVIEW_PAYMENT_METHOD.PAYPAL }],
};
