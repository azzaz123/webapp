import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  ClickAcceptOffer,
  ClickAddEditAddress,
  ClickHelpTransactional,
  ClickItemCard,
  ClickOtherProfile,
  ClickRejectOffer,
  ClickScheduleHPU,
  ViewAcceptOffer,
} from '@core/analytics/analytics-constants';
import { AcceptScreenCarrier, AcceptScreenProperties, AcceptScreenSeller } from '../../interfaces';

export function getClickItemCardEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ClickItemCard> {
  return {
    itemId: properties.request.itemId,
    categoryId: properties.item.categoryId,
    title: properties.item.title,
    salePrice: properties.request.sellerRevenue.itemPrice.amount.total,
    isPro: properties.seller.isPro,
    isCarDealer: properties.seller.isCarDealer,
    sellerUserId: properties.seller.id,
    sellerRating: properties.seller.rating,
  };
}

export function getClickOtherProfileEventPropertiesFromSeller(seller: AcceptScreenSeller): Partial<ClickOtherProfile> {
  return {
    isPro: seller.isPro,
    sellerUserId: seller.id,
  };
}

export function getClickHelpTransactionalEventPropertiesFromProperties(
  properties: AcceptScreenProperties
): Partial<ClickHelpTransactional> {
  return {
    itemId: properties.request.itemId,
    categoryId: properties.item.categoryId,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    sellerUserId: properties.seller.id,
    helpName: 'Help Top Accept Screen',
  };
}

export function getViewAcceptOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ViewAcceptOffer> {
  return {
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

export function getClickAddEditAddressEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ClickAddEditAddress> {
  return {
    addOrEdit: properties.seller.fullAddress ? 'add' : 'edit',
    addressType: getAddressType(properties.carriers),
    requestId: properties.request.id,
    itemId: properties.request.itemId,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
  };
}

export function getClickScheduleHPUEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ClickScheduleHPU> {
  return {
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

export function getClickAcceptOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ClickAcceptOffer> {
  return {
    itemId: properties.request.itemId,
    buyerUserId: properties.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    isPro: properties.seller.isPro,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
    method: this.getSelectedMethod(properties.carriers),
  };
}

export function getClickRejectOfferEventPropertiesFromProperties(properties: AcceptScreenProperties): Partial<ClickRejectOffer> {
  return {
    itemId: properties.request.itemId,
    buyerUserId: properties.buyer.id,
    requestId: properties.request.id,
    categoryId: properties.item.categoryId,
    isPro: properties.seller.isPro,
    totalPrice: properties.request.sellerRevenue.totalPrice.amount.total,
    offeredPrice: properties.request.offeredPrice.amount.total,
    itemPrice: properties.request.sellerRevenue.itemPrice.amount.total,
    title: properties.item.title,
    method: this.getSelectedMethod(properties.carriers),
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
