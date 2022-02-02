import { MOCK_ITEM, MOCK_ITEM_WITHOUT_IMAGE } from '@fixtures/item.fixtures.spec';
import {
  AcceptScreenItem,
  AcceptScreenBuyer,
  AcceptScreenSeller,
  AcceptScreenProperties,
  AcceptScreenCarrier,
  AcceptScreenDropOffPoint,
  AcceptScreenHomePickUp,
} from '@private/features/accept-screen/interfaces';
import { MOCK_USER, MOCK_OTHER_USER, MOCK_OTHER_USER_WITHOUT_IMAGE, MOCK_USER_WITHOUT_IMAGE } from '@fixtures/user.fixtures.spec';
import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers/money/money-mapper';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { PLACEHOLDER_AVATAR } from '@core/user/user';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { MOCK_CARRIER_DROP_OFF_MODE_REQUEST } from './carrier-drop-off-mode-request.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR } from '../delivery-address.fixtures.spec';
import { AcceptScreenDeliveryAddress } from '@private/features/accept-screen/interfaces/accept-screen-delivery-address.interface';
import { FALLBACK_NOT_FOUND_SRC } from '@private/core/constants/fallback-images-src-constants';

export const MOCK_ACCEPT_SCREEN_ITEM: AcceptScreenItem = {
  id: MOCK_ITEM.id,
  title: MOCK_ITEM.title,
  price: mapNumberAndCurrencyCodeToMoney({
    number: MOCK_ITEM.salePrice,
    currency: MOCK_ITEM.currencyCode as CurrencyCode,
  }),
  imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
};

export const MOCK_ACCEPT_SCREEN_ITEM_WITHOUT_IMAGE: AcceptScreenItem = {
  id: MOCK_ITEM_WITHOUT_IMAGE.id,
  title: MOCK_ITEM_WITHOUT_IMAGE.title,
  price: mapNumberAndCurrencyCodeToMoney({
    number: MOCK_ITEM_WITHOUT_IMAGE.salePrice,
    currency: MOCK_ITEM_WITHOUT_IMAGE.currencyCode as CurrencyCode,
  }),
  imageUrl: FALLBACK_NOT_FOUND_SRC,
};

export const MOCK_ACCEPT_SCREEN_BUYER: AcceptScreenBuyer = {
  id: MOCK_OTHER_USER.id,
  imageUrl: MOCK_OTHER_USER.image.urls_by_size.original,
  name: MOCK_OTHER_USER.microName,
};

export const MOCK_ACCEPT_SCREEN_BUYER_WITHOUT_IMAGE: AcceptScreenBuyer = {
  id: MOCK_OTHER_USER_WITHOUT_IMAGE.id,
  imageUrl: PLACEHOLDER_AVATAR,
  name: MOCK_OTHER_USER_WITHOUT_IMAGE.microName,
};

export const MOCK_ACCEPT_SCREEN_SELLER: AcceptScreenSeller = {
  id: MOCK_USER.id,
  imageUrl: MOCK_USER.image.urls_by_size.original,
  address: null,
};

export const MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE: AcceptScreenSeller = {
  id: MOCK_USER_WITHOUT_IMAGE.id,
  imageUrl: PLACEHOLDER_AVATAR,
  address: null,
};

export const MOCK_ACCEPT_SCREEN_CARRIERS: AcceptScreenCarrier[] = [
  {
    type: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].type,
    icon: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].icon,
    isSelected: null,
    cost: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].sellerCosts,
    acceptEndpoint: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].acceptEndpoint,
    restrictions: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].restrictions,
    selectedOffice: null,
    postOfficeDetails: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[0].postOfficeDetails,
  } as AcceptScreenDropOffPoint,
  {
    type: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].type,
    icon: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].icon,
    isSelected: null,
    cost: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].sellerCosts,
    acceptEndpoint: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].acceptEndpoint,
    restrictions: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].restrictions,
    schedule: MOCK_CARRIER_DROP_OFF_MODE_REQUEST.modes[1].schedule,
  } as AcceptScreenHomePickUp,
];

export const MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS: AcceptScreenDeliveryAddress = {
  fullAddress: `${MOCK_DELIVERY_ADDRESS.street}, ${MOCK_DELIVERY_ADDRESS.flat_and_floor}, ${MOCK_DELIVERY_ADDRESS.postal_code}, ${MOCK_DELIVERY_ADDRESS.city}`,
};

export const MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR: AcceptScreenDeliveryAddress = {
  fullAddress: `${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.street}, ${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.postal_code}, ${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.city}`,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES: AcceptScreenProperties = {
  request: MOCK_SELLER_REQUEST,
  item: MOCK_ACCEPT_SCREEN_ITEM,
  buyer: MOCK_ACCEPT_SCREEN_BUYER,
  seller: MOCK_ACCEPT_SCREEN_SELLER,
  carriers: MOCK_ACCEPT_SCREEN_CARRIERS,
  deliveryAddress: MOCK_ACCEPT_SCREEN_DELIVERY_ADDRESS,
};
