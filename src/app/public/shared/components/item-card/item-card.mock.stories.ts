import { ITEM_DATA } from '@fixtures/item.fixtures.spec';
import { ItemCard } from './interfaces/item-card.interface';

export const MOCK_ITEM_1: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: 'Title max chars, title max chars, title max chars.',
  description:
    'Long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max ch',
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
  flags: ITEM_DATA.flags,
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

MOCK_ITEM_1.mainImage.urls_by_size = {
  original: 'http://localhost:6006/images/item-camera.jpg',
  small: 'http://localhost:6006/images/item-camera.jpg',
  large: 'http://localhost:6006/images/item-camera.jpg',
  medium: 'http://localhost:6006/images/item-camera.jpg',
  xlarge: 'http://localhost:6006/images/item-camera.jpg',
};

export const MOCK_ITEM_2: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: 'Title max chars, title max chars, title max chars.',
  description:
    'Long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max ch',
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
  flags: ITEM_DATA.flags,
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
};

export const MOCK_ITEM_3: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
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

export const MOCK_ITEM_4: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
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

export const MOCK_ITEM_5: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
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

export const MOCK_ITEM_6: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
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

export const MOCK_ITEM_7: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: ITEM_DATA.owner,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
  flags: {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: false,
  },
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
