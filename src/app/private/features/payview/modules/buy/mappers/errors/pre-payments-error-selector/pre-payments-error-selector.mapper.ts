import {
  EmptyBuyerAddressError,
  EmptyPostOfficeAddressError,
  EmptyPostOfficeReturnAddressError,
  NoDeliveryMethodSelectedError,
  NoPaymentSelectedError,
  PaymentInfoMissingError,
  PrePaymentError,
  PrePaymentUnknownError,
} from '@api/core/errors/delivery/payview/pre-payment';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';
import { PayviewStateDelivery } from '@private/features/payview/interfaces/payview-state-delivery.interface';
import { PayviewStatePayment } from '@private/features/payview/interfaces/payview-state-payment.interface';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

export const prePaymentsErrorSelector = (payviewState: PayviewState): PrePaymentError | null => {
  let error: PrePaymentError;
  if (!payviewState) {
    return new PrePaymentUnknownError();
  }
  const deliveryError: PrePaymentError = checkDeliveryMethodConditions(payviewState.delivery);
  const paymentError: PrePaymentError = checkPaymentConditions(payviewState.payment);
  if (deliveryError) error = deliveryError;
  if (paymentError) error = paymentError;

  return error;
};

function checkDeliveryMethodConditions(deliveryMethods: PayviewStateDelivery): PrePaymentError | null {
  const selectedCarrier: DeliveryBuyerDeliveryMethod = deliveryMethods.methods.current;
  if (!selectedCarrier) {
    return new NoDeliveryMethodSelectedError();
  }
  if (!selectedCarrier.lastAddressUsed) {
    if (selectedCarrier.method === DELIVERY_MODE.BUYER_ADDRESS) {
      return new EmptyBuyerAddressError();
    }
    if (selectedCarrier.method === DELIVERY_MODE.CARRIER_OFFICE) {
      return new EmptyPostOfficeAddressError();
    }
  }
  if (selectedCarrier.method === DELIVERY_MODE.CARRIER_OFFICE && !deliveryMethods.address) {
    return new EmptyPostOfficeReturnAddressError();
  }
}

function checkPaymentConditions(paymentState: PayviewStatePayment): PrePaymentError | null {
  if (!paymentState.preferences.preferences) {
    return new NoPaymentSelectedError();
  }
  if (selectedPaymentMethodIsAnEmptyCard(paymentState)) {
    return new PaymentInfoMissingError();
  }
}

function selectedPaymentMethodIsAnEmptyCard(paymentState: PayviewStatePayment): boolean {
  return paymentState.preferences.preferences.paymentMethod === PAYVIEW_PAYMENT_METHOD.CREDIT_CARD && !paymentState.card;
}
