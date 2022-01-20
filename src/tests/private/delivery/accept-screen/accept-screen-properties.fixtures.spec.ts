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
  imageUrl: null,
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

export const MOCK_ACCEPT_SCREEN_PROPERTIES: AcceptScreenProperties = {
  request: MOCK_SELLER_REQUEST,
  item: MOCK_ACCEPT_SCREEN_ITEM,
  buyer: MOCK_ACCEPT_SCREEN_BUYER,
  seller: MOCK_ACCEPT_SCREEN_SELLER,
};
