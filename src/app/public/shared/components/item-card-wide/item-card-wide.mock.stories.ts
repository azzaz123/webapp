import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { ITEM_DATA } from '@fixtures/item.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CATEGORY_IDS } from '@core/category/category-ids';

export const MOCK_ITEM_CARD_WIDE: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_WITH_SPECS: ItemCard = {
  ...MOCK_ITEM_CARD_WIDE,
  specs: [MOCK_CAR.engine, MOCK_CAR.bodyType],
};

export const MOCK_ITEM_CARD_WIDE_GBP: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image, ITEM_DATA.main_image],
  webSlug: ITEM_DATA.web_slug,
  currencyCode: 'GBP',
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_FAVOURITE: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
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
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_RESERVED: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
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
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_SOLD: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
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
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_BUMPED: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
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
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_COUNTRY_BUMPED: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
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
  ownerId: ITEM_DATA.owner,
};

export const MOCK_ITEM_CARD_WIDE_WITHOUT_IMAGES: ItemCard = {
  id: ITEM_DATA.id,
  categoryId: CATEGORY_IDS.CAR,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [],
  flags: ITEM_DATA.flags,
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
  ownerId: ITEM_DATA.owner,
};
