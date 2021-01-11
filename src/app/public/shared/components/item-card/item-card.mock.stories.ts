import { Item } from '@core/item/item';
import { ITEM_DATA, MOCK_ITEM } from '@fixtures/item.fixtures.spec';

export const MOCK_ITEM_1 = MOCK_ITEM;

MOCK_ITEM_1.mainImage.urls_by_size = {
  original:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=ORIGINAL',
  small:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W320',
  large:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W800',
  medium:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W640',
  xlarge:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W1024',
};

export const MOCK_ITEM_2 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  'Title max chars, title max chars, title max chars.',
  'Long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max ch',
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  ITEM_DATA.flags,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_3 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: true,
    sold: false,
    reserved: false,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_4 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_5 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: true,
    reserved: false,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_6 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: false,
    bumped: true,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
export const MOCK_ITEM_7 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: true,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
