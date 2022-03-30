import { PayviewState } from '../../interfaces/payview-state.interface';
import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { SCREEN_IDS } from '@core/analytics/resources/analytics-screen-ids';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '../../modules/delivery/enums/payview-delivery-event-type.enum';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods/delivery-buyer-delivery-method.interface';
import { ClickHelpTransactional } from '@core/analytics/resources/events-interfaces/click-help-transactional.interface';
import { ViewTransactionPayScreen } from '@core/analytics/resources/events-interfaces/view-transaction-pay-screen.interface';
import { PaymentMethod } from '@api/core/model/payments/enums/payment-method.enum';
import { ClickAddPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-add-promocode-transaction-pay.interface';
import { ClickApplyPromocodeTransactionPay } from '@core/analytics/resources/events-interfaces/click-apply-promocode-transaction-pay.interface';
import { USER_ACTION, ADDRESS_TYPE } from './tracking-events-action.enum';

export function getViewTransactionPayScreenEventPropertiesFromPayviewState(payviewState: PayviewState): ViewTransactionPayScreen {
  return {
    screenId: SCREEN_IDS.Checkout,
    itemId: payviewState.item.id,
    categoryId: payviewState.item.categoryId,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
    feesPrice: payviewState.costs.buyerCost.fees.amount.total,
    sellerUserId: payviewState.itemDetails.sellerUserHash,
    preselectedPaymentMethod: getPreselectedPaymentMethod(payviewState.payment.preferences.preferences.paymentMethod),
    useWallet: payviewState.payment.preferences.preferences.useWallet,
    sellerCountry: payviewState.itemDetails.sellerCountry,
  };
}

export function getClickAddEditCardEventPropertiesFromPayviewState(payviewState: PayviewState): ClickAddEditCard {
  return {
    screenId: SCREEN_IDS.Checkout,
    addOrEdit: getAddOrEditCard(payviewState.payment.card),
    itemId: payviewState.item.id,
    categoryId: payviewState.item.categoryId,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
  };
}

export function getClickAddEditAddressEventPropertiesFromPayviewState(
  payviewState: PayviewState,
  eventType: PAYVIEW_DELIVERY_EVENT_TYPE
): ClickAddEditAddress {
  return {
    screenId: SCREEN_IDS.Checkout,
    addOrEdit: getAddOrEditAddress(payviewState.delivery.methods.current, eventType),
    addressType: getAddressType(eventType),
    categoryId: payviewState.item.categoryId,
    itemId: payviewState.item.id,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
  };
}

export function getClickHelpTransactionalEventPropertiesFromPayviewState(payviewState: PayviewState): ClickHelpTransactional {
  return {
    screenId: SCREEN_IDS.Checkout,
    sellerUserId: payviewState.item.owner,
    helpName: 'Help Top Pay Screen',
    categoryId: payviewState.item.categoryId,
    itemId: payviewState.item.id,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
  };
}

export function getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState(
  payviewState: PayviewState
): ClickAddPromocodeTransactionPay {
  return {
    screenId: SCREEN_IDS.Checkout,
    itemId: payviewState.item.id,
    categoryId: payviewState.item.categoryId,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
    sellerUserId: payviewState.item.owner,
  };
}

export function getClickApplyPromocodeTransactionPayEventPropertiesFromPayviewState(
  payviewState: PayviewState
): ClickApplyPromocodeTransactionPay {
  return {
    screenId: SCREEN_IDS.Checkout,
    itemId: payviewState.item.id,
    categoryId: payviewState.item.categoryId,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
    sellerUserId: payviewState.item.owner,
  };
}

function getAddOrEditCard(card: CreditCard): ClickAddEditCard['addOrEdit'] {
  return card ? USER_ACTION.EDIT : USER_ACTION.ADD;
}

function getAddressType(eventType: PAYVIEW_DELIVERY_EVENT_TYPE): ClickAddEditAddress['addressType'] {
  return eventType === PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN ? ADDRESS_TYPE.HOME : ADDRESS_TYPE.OFFICE;
}

function getAddOrEditAddress(
  currentDeliveryMethod: DeliveryBuyerDeliveryMethod,
  eventType: PAYVIEW_DELIVERY_EVENT_TYPE
): ClickAddEditAddress['addOrEdit'] {
  if (eventType === PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN) {
    return USER_ACTION.EDIT;
  }
  return currentDeliveryMethod.lastAddressUsed ? USER_ACTION.EDIT : USER_ACTION.ADD;
}

function getPreselectedPaymentMethod(paymentPreference: PaymentMethod): ViewTransactionPayScreen['preselectedPaymentMethod'] {
  return PRESELECTED_PAYMENT_METHOD_CONVERTER[paymentPreference];
}

const PRESELECTED_PAYMENT_METHOD_CONVERTER: Record<PaymentMethod, ViewTransactionPayScreen['preselectedPaymentMethod']> = {
  [PaymentMethod.CREDIT_CARD]: 'bank card',
  [PaymentMethod.PAYPAL]: 'paypal',
  [PaymentMethod.WALLET]: 'wallet',
  [PaymentMethod.WALLET_AND_CREDIT_CARD]: 'wallet, bank card',
  [PaymentMethod.WALLET_AND_PAYPAL]: 'wallet, paypal',
};
