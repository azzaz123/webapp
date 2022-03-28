import { PayviewState } from '../../interfaces/payview-state.interface';
import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { SCREEN_IDS } from '@core/analytics/resources/analytics-screen-ids';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '../../modules/delivery/enums/payview-delivery-event-type.enum';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods/delivery-buyer-delivery-method.interface';

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

function getAddOrEditCard(card: CreditCard): ClickAddEditCard['addOrEdit'] {
  return card ? 'edit' : 'add';
}

function getAddressType(eventType: PAYVIEW_DELIVERY_EVENT_TYPE): ClickAddEditAddress['addressType'] {
  return eventType === PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN ? 'home' : 'office';
}

function getAddOrEditAddress(
  currentDeliveryMethod: DeliveryBuyerDeliveryMethod,
  eventType: PAYVIEW_DELIVERY_EVENT_TYPE
): ClickAddEditAddress['addOrEdit'] {
  if (eventType === PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN) {
    return 'edit';
  }
  return currentDeliveryMethod.lastAddressUsed ? 'edit' : 'add';
}
