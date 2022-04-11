import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  SCREEN_IDS,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenBuyer } from '../../interfaces/accept-screen-buyer.interface';

export function getClickItemCardEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickItemCard {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    position: 0,
    itemId: properties.request.itemId,
    categoryId: properties.item.categoryId,
    title: properties.item.title,
    salePrice: properties.request.sellerRevenue.itemPrice.amount.total,
    isPro: properties.seller.isPro,
    isCarDealer: properties.seller.isCarDealer,
    sellerUserId: properties.seller.id,
    sellerRating: properties.seller.rating,
    shippingAllowed: properties.item.shippingAllowed,
  };
}

export function getClickOtherProfileEventPropertiesFromSeller(buyer: AcceptScreenBuyer): ClickOtherProfile {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    isPro: buyer.isPro,
    sellerUserId: buyer.id,
  };
}

export function getClickHelpTransactionalEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickHelpTransactional {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    itemId: properties.request.itemId,
    categoryId: properties.item.categoryId,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    sellerUserId: properties.seller.id,
    helpName: 'Help Top Accept Screen',
  };
}

export function getViewAcceptOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): ViewAcceptOffer {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    itemId: properties.request.itemId,
    buyerUserId: properties.request.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    isPro: properties.seller.isPro,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
    method: getSelectedMethod(properties.carriers),
    buyerCountry: properties.buyer.countryISOCode,
  };
}

export function getClickAddEditAddressEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickAddEditAddress {
  const sellerHasFullAddress: boolean = properties.seller.fullAddress && properties.seller.fullAddress !== '';
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    addOrEdit: !!sellerHasFullAddress ? 'edit' : 'add',
    addressType: getAddressType(properties.carriers),
    requestId: properties.request.id,
    itemId: properties.request.itemId,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
  };
}

export function getClickScheduleHPUEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickScheduleHPU {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    itemId: properties.request.itemId,
    buyerUserId: properties.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
  };
}

export function getClickAcceptOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickAcceptOffer {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    itemId: properties.request.itemId,
    buyerUserId: properties.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    isPro: properties.seller.isPro,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
    method: getSelectedMethod(properties.carriers),
  };
}

export function getClickRejectOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): ClickRejectOffer {
  return {
    screenId: SCREEN_IDS.AcceptOffer,
    itemId: properties.request.itemId,
    buyerUserId: properties.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    isPro: properties.seller.isPro,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
    method: getSelectedMethod(properties.carriers),
  };
}

function getAddressType(carriers: AcceptScreenCarrier[]): ClickAddEditAddress['addressType'] {
  const selectedCarrier: AcceptScreenCarrier = carriers.find((carrier: AcceptScreenCarrier) => carrier.isSelected);
  return selectedCarrier.type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? 'home' : 'office';
}

function getSelectedMethod(
  carriers: AcceptScreenCarrier[]
): ClickRejectOffer['method'] | ClickAcceptOffer['method'] | ViewAcceptOffer['method'] {
  const selectedCarrier: AcceptScreenCarrier = carriers.find((carrier: AcceptScreenCarrier) => carrier.isSelected);
  return selectedCarrier.type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? 'HPU' : 'correos';
}
