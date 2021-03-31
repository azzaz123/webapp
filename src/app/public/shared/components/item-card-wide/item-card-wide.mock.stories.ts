import { ITEM_DATA } from '@fixtures/item.fixtures.spec';
import { ItemCardWide } from './interfaces/item-card-wide.interface';

export const MOCK_ITEM_CARD_WIDE: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_GBP: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  webSlug: ITEM_DATA.web_slug,
  currencyCode: 'GBP',
};

export const MOCK_ITEM_CARD_WIDE_FAVOURITE: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  flags: {
    pending: false,
    banned: false,
    expired: false,
    favorite: true,
    sold: false,
    reserved: false,
    bumped: false,
  },
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_RESERVED: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  flags: {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: false,
  },
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_SOLD: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  flags: {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: true,
    reserved: false,
    bumped: false,
  },
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_BUMPED: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  flags: ITEM_DATA.flags,
  bumpFlags: {
    bumped: true,
    highlighted: false,
    urgent: false,
    country_bumped: false,
    boosted: false,
  },
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_COUNTRY_BUMPED: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  flags: ITEM_DATA.flags,
  bumpFlags: {
    bumped: false,
    highlighted: false,
    urgent: false,
    country_bumped: true,
    boosted: false,
  },
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_CARD_WIDE_WITHOUT_IMAGES: ItemCardWide = {
  id: ITEM_DATA.id,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: null,
  flags: ITEM_DATA.flags,
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};
