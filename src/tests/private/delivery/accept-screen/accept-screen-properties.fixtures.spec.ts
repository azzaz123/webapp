import { MOCK_ITEM, MOCK_ITEM_WITHOUT_IMAGE } from '@fixtures/item.fixtures.spec';
import {
  AcceptScreenItem,
  AcceptScreenBuyer,
  AcceptScreenSeller,
  AcceptScreenProperties,
} from '@private/features/accept-screen/interfaces';
import { MOCK_USER, MOCK_OTHER_USER, MOCK_OTHER_USER_WITHOUT_IMAGE, MOCK_USER_WITHOUT_IMAGE } from '@fixtures/user.fixtures.spec';
import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers/money/money-mapper';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { PLACEHOLDER_AVATAR } from '@core/user/user';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR } from '../delivery-address.fixtures.spec';
import { FALLBACK_NOT_FOUND_SRC } from '@private/core/constants/fallback-images-src-constants';
import { MOCK_PENDING_SELLER_REQUEST } from '../seller-requests/seller-request.fixtures.spec';
import {
  MOCK_ACCEPT_SCREEN_CARRIERS,
  MOCK_ACCEPT_SCREEN_CARRIERS_2,
  MOCK_ACCEPT_SCREEN_CARRIERS_NONE_SELECTED,
  MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED,
} from './accept-screen-properties-carriers.fixtures.spec';
import { USER_TYPE } from '@core/user/user.service';

export const MOCK_ACCEPT_SCREEN_ITEM: AcceptScreenItem = {
  id: MOCK_ITEM.id,
  title: MOCK_ITEM.title,
  price: mapNumberAndCurrencyCodeToMoney({
    number: MOCK_ITEM.salePrice,
    currency: MOCK_ITEM.currencyCode as CurrencyCode,
  }),
  imageUrl: MOCK_ITEM.images[0].urls_by_size.original,
  categoryId: MOCK_ITEM.categoryId,
};

export const MOCK_ACCEPT_SCREEN_ITEM_WITHOUT_IMAGE: AcceptScreenItem = {
  id: MOCK_ITEM_WITHOUT_IMAGE.id,
  title: MOCK_ITEM_WITHOUT_IMAGE.title,
  price: mapNumberAndCurrencyCodeToMoney({
    number: MOCK_ITEM_WITHOUT_IMAGE.salePrice,
    currency: MOCK_ITEM_WITHOUT_IMAGE.currencyCode as CurrencyCode,
  }),
  imageUrl: FALLBACK_NOT_FOUND_SRC,
  categoryId: MOCK_ITEM_WITHOUT_IMAGE.categoryId,
};

export const MOCK_ACCEPT_SCREEN_BUYER: AcceptScreenBuyer = {
  id: MOCK_OTHER_USER.id,
  imageUrl: MOCK_OTHER_USER.image.urls_by_size.original,
  name: MOCK_OTHER_USER.microName,
  countryISOCode: MOCK_OTHER_USER.location.country_code,
};

export const MOCK_ACCEPT_SCREEN_BUYER_WITHOUT_IMAGE: AcceptScreenBuyer = {
  id: MOCK_OTHER_USER_WITHOUT_IMAGE.id,
  imageUrl: PLACEHOLDER_AVATAR,
  name: MOCK_OTHER_USER_WITHOUT_IMAGE.microName,
  countryISOCode: MOCK_OTHER_USER_WITHOUT_IMAGE.location.country_code,
};

export const MOCK_ACCEPT_SCREEN_SELLER: AcceptScreenSeller = {
  id: MOCK_USER.id,
  imageUrl: MOCK_USER.image.urls_by_size.original,
  fullAddress: `${MOCK_DELIVERY_ADDRESS.street}, ${MOCK_DELIVERY_ADDRESS.flat_and_floor}, ${MOCK_DELIVERY_ADDRESS.postal_code}, ${MOCK_DELIVERY_ADDRESS.city}`,
  isPro: MOCK_USER.featured,
  isCarDealer: MOCK_USER.type === USER_TYPE.PROFESSIONAL,
  rating: MOCK_USER.scoringStars,
};

export const MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_ADDRESS: AcceptScreenSeller = {
  id: MOCK_USER.id,
  imageUrl: MOCK_USER.image.urls_by_size.original,
  fullAddress: null,
  isPro: MOCK_USER.featured,
  isCarDealer: MOCK_USER.type === USER_TYPE.PROFESSIONAL,
  rating: MOCK_USER.scoringStars,
};

export const MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_IMAGE: AcceptScreenSeller = {
  id: MOCK_USER_WITHOUT_IMAGE.id,
  imageUrl: PLACEHOLDER_AVATAR,
  fullAddress: `${MOCK_DELIVERY_ADDRESS.street}, ${MOCK_DELIVERY_ADDRESS.flat_and_floor}, ${MOCK_DELIVERY_ADDRESS.postal_code}, ${MOCK_DELIVERY_ADDRESS.city}`,
  isPro: MOCK_USER_WITHOUT_IMAGE.featured,
  isCarDealer: MOCK_USER_WITHOUT_IMAGE.type === USER_TYPE.PROFESSIONAL,
  rating: MOCK_USER_WITHOUT_IMAGE.scoringStars,
};

export const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS: string = `${MOCK_DELIVERY_ADDRESS.street}, ${MOCK_DELIVERY_ADDRESS.flat_and_floor}, ${MOCK_DELIVERY_ADDRESS.postal_code}, ${MOCK_DELIVERY_ADDRESS.city}`;

export const MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_WITHOUT_FLAT_AND_FLOOR: string = `${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.street}, ${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.postal_code}, ${MOCK_DELIVERY_ADDRESS_WITHOUT_FLAT_AND_FLOOR.city}`;

export const MOCK_ACCEPT_SCREEN_PROPERTIES: AcceptScreenProperties = {
  request: MOCK_SELLER_REQUEST,
  item: MOCK_ACCEPT_SCREEN_ITEM,
  buyer: MOCK_ACCEPT_SCREEN_BUYER,
  seller: MOCK_ACCEPT_SCREEN_SELLER,
  carriers: MOCK_ACCEPT_SCREEN_CARRIERS_2,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_CARRIER_SELECTED: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES,
  carriers: MOCK_ACCEPT_SCREEN_CARRIERS_NONE_SELECTED,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_PENDING_STATUS: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES,
  request: MOCK_PENDING_SELLER_REQUEST,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_PENDING_STATUS,
  seller: MOCK_ACCEPT_SCREEN_SELLER_WITHOUT_ADDRESS,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES,
  carriers: MOCK_ACCEPT_SCREEN_CARRIERS,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_SCHEDULE_DEFINED_FIRST_SELECTED: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES,
  carriers: MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED,
};

export const MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_SCHEDULE_DEFINED_SECOND_SELECTED: AcceptScreenProperties = {
  ...MOCK_ACCEPT_SCREEN_PROPERTIES,
  carriers: [
    { ...MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED[0], isSelected: false },
    { ...MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED[1], isSelected: true },
  ],
};
