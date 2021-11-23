import { OrderEvent } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { clone } from 'lodash-es';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CATEGORY_IDS } from '../app/core/category/category-ids';
import { Item, ITEM_TYPES } from '../app/core/item/item';
import { CARS_CATEGORY, REALESTATE_CATEGORY } from '../app/core/item/item-categories';
import {
  AllowedActionResponse,
  AvailableProductsResponse,
  CarUploadForm,
  ConversationUser,
  DeliveryInfo,
  Duration,
  ItemActions,
  ItemBulkResponse,
  ItemContent,
  ItemCounters,
  ItemExtraInfo,
  ItemFlags,
  ItemProResponse,
  ItemResponse,
  ItemResponseV2,
  ItemSaleConditions,
  ItemsWithAvailableProductsResponse,
  ItemUploadForm,
  ItemVisibilityFlags,
  ItemWithProducts,
  LatestItemResponse,
  Order,
  Product,
  ProductDurations,
  Purchase,
  RealEstateUploadForm,
} from '../app/core/item/item-response.interface';
import { Image, UserLocation } from '../app/core/user/user-response.interface';
import { CartItem } from '../app/shared/catalog/cart/cart-item.interface';
import { MOCK_USER, USER_ID, USER_LOCATION } from './user.fixtures.spec';
import { MOCK_ITEM_VISIBILITY_FLAGS_BUMPED } from '@fixtures/item-detail-flags.fixtures.spec';
import { ItemCondition } from '@core/item/item-condition';

export const PICTURE_ID = '9jd7ryx5odjk';
export const ITEM_CATEGORY_ID = 12545;
export const ITEM_ID = '9jd7ryx5odjk';
export const ITEM_LEGACY_ID = 500002512;
export const ITEM_TITLE = 'The title';
export const ITEM_TITLE2 = 'The title2';
export const ITEM_DESCRIPTION = 'The description';
export const ITEM_DESCRIPTION2 = 'The description2';
export const ITEM_DISTANCE = 2353;

export const ITEM_LOCATION: UserLocation = {
  id: 101,
  approximated_latitude: 41.399132621722174,
  approximated_longitude: 2.17585484411869,
  city: 'Barcelona',
  zip: '08009',
  approxRadius: 0,
};

export const ITEM_LOCATION_WITH_APROX = {
  ...ITEM_LOCATION,
  approximated_location: true,
};

export const ITEM_LOCATION_WITHOUT_COORDINATES: UserLocation = {
  id: 101,
  approximated_latitude: null,
  approximated_longitude: null,
  city: 'Barcelona',
  zip: '08009',
  approxRadius: 0,
};

export const ITEM_SALE_PRICE = 123.45;
export const ITEM_SALE_PRICE2 = 1230;
export const ITEM_CURRENCY_CODE = 'EUR';
export const ITEM_MODIFIED_DATE = 1474554861894;
export const ITEM_URL = 'http://dock9.wallapop.com/i/500002512?_pid=wi&_uid=500002512';
export const ITEM_WEB_SLUG = 'webslug-9jd7ryx5odjk';
export const ITEM_PUBLISHED_DATE = 1473784861894;
export const ITEM_PUBLISHED_DATE2 = 1473784861898;
export const ITEM_DELIVERY_INFO: DeliveryInfo = {
  min_weight_kg: 5,
  max_weight_kg: 10,
};

export const ITEM_FLAGS: ItemFlags = {
  pending: false,
  sold: false,
  favorite: false,
  reserved: false,
  removed: false,
  banned: false,
  expired: false,
  review_done: false,
  bumped: false,
  highlighted: false,
};

export const ITEM_FLAGS_BUMPED: ItemFlags = {
  pending: false,
  sold: false,
  favorite: false,
  reserved: false,
  removed: false,
  banned: false,
  expired: false,
  review_done: false,
  bumped: true,
  highlighted: false,
};

export const ITEM_ACTIONS_ALLOWED: ItemActions = {
  chat: true,
  share: true,
  check_profile: true,
  report: true,
  favorite: true,
  visible: true,
  edit: false,
  reserve: false,
  sell: false,
  delete: false,
};

export const ITEM_SALE_CONDITIONS: ItemSaleConditions = {
  fix_price: false,
  exchange_allowed: false,
  supports_shipping: false,
};

export const ITEM_MAIN_IMAGE: Image = {
  id: '4z4vl5ygwvzy',
  legacy_id: 500002514,
  original_width: 100,
  original_height: 62,
  average_hex_color: '6a707b',
  urls_by_size: {
    original: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=ORIGINAL',
    small: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    large: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    medium: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    xlarge: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
  },
};

export const ITEM_LARGE_IMAGE = 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320';
export const ITEM_XLARGE_IMAGE = 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320';

export const ITEM_IMAGES: Image[] = [
  {
    id: '4z4vl5ygwvzy',
    legacy_id: 500002514,
    original_width: 100,
    original_height: 62,
    average_hex_color: '6a707b',
    urls_by_size: {
      original: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=ORIGINAL',
      small: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
      large: ITEM_LARGE_IMAGE,
      medium: 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
      xlarge: ITEM_XLARGE_IMAGE,
    },
  },
];

export const ITEM_DATA: ItemResponseV2 = {
  id: ITEM_ID,
  legacy_id: ITEM_LEGACY_ID,
  title: ITEM_TITLE,
  description: ITEM_DESCRIPTION,
  owner: USER_ID,
  category_id: ITEM_CATEGORY_ID,
  location: ITEM_LOCATION,
  sale_price: ITEM_SALE_PRICE,
  currency_code: ITEM_CURRENCY_CODE,
  modified_date: ITEM_MODIFIED_DATE,
  url: ITEM_URL,
  flags: ITEM_FLAGS,
  actions_allowed: ITEM_ACTIONS_ALLOWED,
  sale_conditions: ITEM_SALE_CONDITIONS,
  main_image: ITEM_MAIN_IMAGE,
  images: ITEM_IMAGES,
  web_slug: ITEM_WEB_SLUG,
  published_date: ITEM_PUBLISHED_DATE,
  delivery_info: ITEM_DELIVERY_INFO,
};

export const ITEM_DATA2: ItemResponseV2 = {
  id: ITEM_ID,
  legacy_id: 500002512,
  title: ITEM_TITLE2,
  description: ITEM_DESCRIPTION2,
  owner: USER_ID,
  category_id: ITEM_CATEGORY_ID,
  location: ITEM_LOCATION,
  sale_price: ITEM_SALE_PRICE2,
  currency_code: ITEM_CURRENCY_CODE,
  modified_date: ITEM_MODIFIED_DATE,
  url: ITEM_URL,
  flags: ITEM_FLAGS,
  actions_allowed: ITEM_ACTIONS_ALLOWED,
  sale_conditions: ITEM_SALE_CONDITIONS,
  main_image: ITEM_MAIN_IMAGE,
  images: ITEM_IMAGES,
  web_slug: ITEM_WEB_SLUG,
  published_date: ITEM_PUBLISHED_DATE2,
};

export const ITEM_DATA3: ItemProResponse = {
  content: {
    id: ITEM_ID,
    title: ITEM_TITLE2,
    description: ITEM_DESCRIPTION2,
    category_id: ITEM_CATEGORY_ID,
    sale_price: ITEM_SALE_PRICE2,
    currency_code: ITEM_CURRENCY_CODE,
    modified_date: ITEM_MODIFIED_DATE,
    url: ITEM_URL,
    flags: ITEM_FLAGS,
    sale_conditions: ITEM_SALE_CONDITIONS,
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    web_slug: ITEM_WEB_SLUG,
    conversations: 0,
    publish_date: ITEM_PUBLISHED_DATE2,
    seller_id: '1',
    purchases: {
      bump_type: 'citybump',
      expiration_date: 1526375664070,
      scheduled_bump_type: 'citybump',
      scheduled_end_date: 1526515200000,
      scheduled_start_date: 1526256000000,
    },
  },
  id: ITEM_ID,
  type: 'Cars',
};

export const ITEM_VIEWS = 123;
export const ITEM_FAVORITES = 456;
export const ITEM_CONVERSATIONS = 100;

export const ITEM_COUNTERS_DATA: ItemCounters = {
  views: ITEM_VIEWS,
  favorites: ITEM_FAVORITES,
  conversations: ITEM_CONVERSATIONS,
};

export const ITEM_BUMP_FLAGS: ItemVisibilityFlags = {
  bumped: false,
  highlighted: false,
  urgent: false,
  country_bumped: false,
  boosted: false,
};

export const ITEM_FASHION_EXTRA_INFO: ItemExtraInfo = {
  object_type: {
    id: '1',
    name: 'Accessories',
  },
  brand: 'Zara',
  model: 'Ring',
  condition: ItemCondition.NEW,
  size: {
    id: '1',
    text: 'XXL / 48 / 58',
  },
  gender: 'male',
};

export const ITEM_CELLPHONES_EXTRA_INFO: ItemExtraInfo = {
  object_type: {
    id: '1',
    name: 'Phones and Accessories',
  },
  brand: 'Apple',
  model: 'iPhone 11 Pro',
};

export const ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE: ItemExtraInfo = {
  object_type: {
    id: '1',
    name: 'Phones and Accessories',
    parent_object_type: {
      id: '5',
      name: 'Case',
    },
  },
  brand: 'Apple',
  model: 'iPhone 11 Pro',
};

export const ITEM_CELLPHONES_EXTRA_INFO_NO_OBJECT_TYPE: ItemExtraInfo = {
  brand: 'Apple',
  model: 'iPhone 11 Pro',
};

export const ITEM_GENERIC_EXTRA_INFO: ItemExtraInfo = {
  condition: ItemCondition.HAS_GIVEN_IT_ALL,
};

export const MOCK_ITEM: Item = new Item(
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
  ITEM_DATA.flags,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_FEATURED: Item = new Item(
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
  ITEM_FLAGS_BUMPED,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info,
  null,
  null,
  null,
  null,
  MOCK_ITEM_VISIBILITY_FLAGS_BUMPED
);

export const MOCK_ITEM_SOLD: Item = new Item(
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
    sold: true,
    reserved: false,
    banned: false,
    expired: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

export const MOCK_ITEM_GBP: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  'GBP',
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

export const MOCK_ITEM_CAR: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  100,
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

export const MOCK_ITEM_WITHOUT_COORDINATES: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  100,
  ITEM_LOCATION_WITHOUT_COORDINATES,
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

export const MOCK_ITEM_APROX_LOCATION: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  100,
  ITEM_LOCATION_WITH_APROX,
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

export const MOCK_ITEM_FASHION: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.FASHION_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS,
  ITEM_FASHION_EXTRA_INFO
);

export const MOCK_ITEM_GAMES_CONSOLES: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.GAMES_CONSOLES,
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

export const MOCK_ITEM_GAMES_CONSOLES_WITH_EXTRA_INFO: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.GAMES_CONSOLES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS,
  ITEM_GENERIC_EXTRA_INFO
);

export const MOCK_ITEM_CELLPHONES: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS,
  ITEM_CELLPHONES_EXTRA_INFO
);

export const MOCK_ITEM_CELLPHONES_WITHOUT_EXTRA_INFO: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS
);

export const MOCK_ITEM_FASHION_WITHOUT_EXTRA_INFO: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.FASHION_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS
);

export const MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS,
  ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE
);

export const MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
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
  ITEM_DATA.delivery_info,
  ITEM_TYPES.CONSUMER_GOODS,
  ITEM_CELLPHONES_EXTRA_INFO_NO_OBJECT_TYPE
);

export const MOCK_ITEM_WITHOUT_LOCATION: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  null,
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

export function getMockItem(id: string, legacyId: number) {
  const item: Item = clone(MOCK_ITEM);
  item.id = id;
  item.legacyId = legacyId;
  return item;
}

export function getMockItemWithPurchases() {
  const item: Item = clone(MOCK_ITEM);
  item.purchases = {
    bump_type: 'citybump',
    expiration_date: 1526375664070,
    scheduled_bump_type: 'citybump',
    scheduled_end_date: 1526515200000,
    scheduled_start_date: 1526256000000,
  };
  return item;
}

export function createItemsArray(total: number, starting: number = 1) {
  const items: Item[] = [];
  for (let i: number = starting; i < total + starting; i++) {
    items.push(getMockItem(i.toString(), i));
  }
  return items;
}

export const ITEMS_BULK_UPDATED_IDS: string[] = ['1', '3', '5'];
export const ITEMS_BULK_FAILED_IDS: string[] = ['2', '4'];
export const ITEMS_BULK_RESPONSE: ItemBulkResponse = {
  updatedIds: ITEMS_BULK_UPDATED_IDS,
  failedIds: [],
};
export const ITEMS_BULK_RESPONSE_FAILED: ItemBulkResponse = {
  updatedIds: ITEMS_BULK_UPDATED_IDS,
  failedIds: ITEMS_BULK_FAILED_IDS,
};

export const MOCK_ITEM_RESPONSE: ItemResponse = {
  id: '0j2ylvwrpmzy',
  type: 'consumer_goods',
  content: {
    id: '0j2ylvwrpmzy',
    title: 'The title',
    description: 'The description',
    category_id: 12545,
    seller_id: 'l1kmzn82zn3p',
    flags: {
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    price: 123.45,
    currency: 'EUR',
    modified_date: 1500545785245,
    url: 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'raton-134690716',
    user: MOCK_USER,
  },
};

export const MOCK_ITEM_RESPONSE_FAVOURITED: ItemResponse = {
  id: '0j2ylvwrpmzy',
  type: 'consumer_goods',
  content: {
    id: '0j2ylvwrpmzy',
    title: 'The title',
    description: 'The description',
    category_id: 12545,
    seller_id: 'l1kmzn82zn3p',
    flags: {
      favorite: true,
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    price: 123.45,
    currency: 'EUR',
    modified_date: 1500545785245,
    url: 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'raton-134690716',
    user: MOCK_USER,
  },
};

export class MockedItemService {
  public get(url: string): Observable<Item> {
    const data: any = ITEM_DATA;
    return of(
      new Item(
        data.id,
        data.legacyId,
        data.owner,
        data.title,
        data.description,
        data.categoryId,
        data.location,
        data.salePrice,
        data.currencyCode,
        data.modifiedDate,
        data.url,
        data.flags,
        data.actionsAllowed,
        data.saleConditions,
        data.mainImage,
        data.images
      )
    );
  }
}

export const ITEM_DATA_V3: ItemResponse = {
  id: '0j2ylvwrpmzy',
  type: 'consumer_goods',
  content: {
    id: '0j2ylvwrpmzy',
    title: 'The title',
    description: 'The description',
    category_id: 12545,
    seller_id: 'l1kmzn82zn3p',
    flags: {
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    currency_code: 'EUR',
    modified_date: 1500545785245,
    url: 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'raton-134690716',
    user: MOCK_USER,
  },
};

export const ITEM_DATA_V4: ItemProResponse = {
  id: '0j2ylvwrpmzy',
  type: 'consumer_goods',
  content: {
    id: '0j2ylvwrpmzy',
    title: 'The title',
    description: 'The description',
    category_id: 12545,
    seller_id: 'l1kmzn82zn3p',
    flags: {
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    price: 123.45,
    currency_code: 'EUR',
    modified_date: 1473784861894,
    publish_date: 1473784861894,
    url: 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    image: {
      original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      original_height: 100,
      original_width: 62,
    },
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'raton-134690716',
    views: 0,
    conversations: 0,
    purchases: {
      bump_type: 'citybump',
      expiration_date: 1526375664070,
      scheduled_bump_type: 'citybump',
      scheduled_end_date: 1526515200000,
      scheduled_start_date: 1526256000000,
    },
  },
};

export const ITEM_DATA_V5: ItemProResponse = {
  id: '0j2ylvwrpmzy',
  type: 'consumer_goods',
  content: {
    id: '0j2ylvwrpmzy',
    title: 'The title',
    description: 'The description',
    category_id: 12545,
    seller_id: 'l1kmzn82zn3p',
    flags: {
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    price: 123.45,
    currency_code: 'EUR',
    modified_date: 1473784861894,
    publish_date: 1473784861894,
    url: 'http://dock2.wallapop.com/i/500002511?_pid=wi&_uid=101',
    images: [
      {
        id: '0j2ylvwrpmzy',
        original_width: 100,
        original_height: 62,
        average_hex_color: '6a707b',
        urls_by_size: {
          original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
          xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
        },
      },
    ],
    image: {
      original: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      small: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      large: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      medium: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      xlarge: 'http://dock2.wallapop.com:8080/shnm-portlet/images?pictureId=500002511&pictureSize=W320',
      original_height: 100,
      original_width: 62,
    },
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'raton-134690716',
    views: 0,
    conversations: 0,
    purchases: {
      bump_type: 'citybump',
      expiration_date: 1526375664070,
      scheduled_bump_type: 'citybump',
      scheduled_end_date: 1526515200000,
      scheduled_start_date: 1526256000000,
    },
  },
};

export const generateMockItemProResponse = (id: number, type, title, imageUrl, categoryId, status): ItemProResponse => {
  const flags = Object.assign({}, ITEM_FLAGS);

  switch (status) {
    case 'inactive':
      flags.onhold = true;
      break;
    case 'sold':
      flags.sold = true;
      break;
  }

  const publish_date =
    moment()
      .add(-id - 1, 'days')
      .unix() * 1000;
  const modified_date = moment().add(-id, 'days').unix() * 1000;

  const mockResponse: ItemProResponse = {
    id: id.toString(),
    type,
    content: {
      category_id: categoryId,
      conversations: 0,
      currency: 'EUR',
      description: 'The description for ' + title,
      favorites: 0,
      flags,
      id: id.toString(),
      image: {
        large: `${imageUrl}?pictureSize=W800`,
        medium: `${imageUrl}?pictureSize=W640`,
        original: `${imageUrl}?pictureSize=W1024`,
        original_height: 62,
        original_width: 100,
        small: `${imageUrl}?pictureSize=W320`,
        xlarge: `${imageUrl}?pictureSize=W1024`,
      },
      modified_date,
      price: id,
      publish_date,
      seller_id: 'l1kmzn82zn3p',
      title,
      views: 0,
      web_slug: 'the-title-180674807',
      purchases: undefined,
    },
  };
  return mockResponse;
};

export const generateMockItemProResponses = (
  ammount: number,
  type: string,
  imageUrl: string,
  categoryId: number,
  status
): ItemProResponse[] => {
  const result: ItemProResponse[] = [];
  for (let i = 0; i < ammount; i++) {
    result.push(generateMockItemProResponse(i, type, 'Taitel-' + i, imageUrl, categoryId, status));
  }
  return result;
};

export const ITEMS_DATA_V3 = [
  {
    id: '1',
    type: 'consumer_goods',
    content: {
      id: '1',
      title: 'Toyota Yaris 1.3 99CV',
      description: 'Marca: Toyota',
      image: {
        original: 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
        small: 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W320',
        large: 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
        medium: 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
        xlarge: 'http://localhost:8080/shnm-portlet/images?pictureId=500009672&pictureSize=W640',
        original_width: 688,
        original_height: 392,
      },
      seller_id: 'l1kmzn82zn3p',
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
        bumped: false,
        highlighted: false,
        urgent: false,
      },
      sale_price: 12900.0,
      currency_code: 'EUR',
      modified_date: 1505891021000,
      publish_date: 1505891021000,
      web_slug: 'toyota-yaris-1-3-99cv-500008657',
      views: 0,
      favorites: 0,
    },
  },
  {
    id: '2',
    type: 'consumer_goods',
    content: {
      id: '2',
      title: 'Volvo V70 XC AWD Cross Country',
      description: 'Marca: Volvo',
      image: {
        original: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        small: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
        large: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        medium: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        xlarge: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        original_width: 688,
        original_height: 392,
      },
      seller_id: 'l1kmzn82zn3p',
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
        bumped: false,
        highlighted: false,
        urgent: false,
      },
      sale_price: 7500.0,
      currency_code: 'EUR',
      modified_date: 1505891020000,
      publish_date: 1505891020000,
      web_slug: 'volvo-v70-xc-awd-cross-country-500008656',
      views: 0,
      favorites: 0,
    },
  },
  {
    id: '3',
    type: 'consumer_goods',
    content: {
      id: '3',
      title: 'Volvo V70 XC AWD Cross Country',
      description: 'Marca: Volvo',
      image: {
        original: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        small: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
        large: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        medium: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        xlarge: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        original_width: 688,
        original_height: 392,
      },
      seller_id: 'l1kmzn82zn3p',
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
        bumped: false,
        highlighted: false,
        urgent: false,
      },
      sale_price: 7500.0,
      currency_code: 'EUR',
      modified_date: 1505891020000,
      publish_date: 1505891020000,
      web_slug: 'volvo-v70-xc-awd-cross-country-500008656',
      views: 0,
      favorites: 0,
    },
  },
  {
    id: '4',
    type: 'consumer_goods',
    content: {
      id: '4',
      title: 'Volvo V70 XC AWD Cross Country',
      description: 'Marca: Volvo',
      image: {
        original: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        small: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W320',
        large: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        medium: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        xlarge: 'http://localhost:8080/shnm-portlet/images?pictureId=500009664&pictureSize=W640',
        original_width: 688,
        original_height: 392,
      },
      seller_id: 'l1kmzn82zn3p',
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
        bumped: false,
        highlighted: false,
        urgent: false,
      },
      sale_price: 7500.0,
      currency_code: 'EUR',
      modified_date: 1505891020000,
      publish_date: 1505891020000,
      web_slug: 'volvo-v70-xc-awd-cross-country-500008656',
      views: 0,
      favorites: 0,
    },
  },
];

export const LATEST_ITEM_COUNT = 3;

export const LATEST_ITEM_DATA: LatestItemResponse = {
  count: LATEST_ITEM_COUNT,
  items: [ITEMS_DATA_V3[0]],
};

export const LATEST_ITEM_DATA_EMPTY: LatestItemResponse = {
  count: LATEST_ITEM_COUNT,
  items: [],
};

export const MOCK_ITEM_V3: Item = new Item(
  ITEMS_DATA_V3[0].content.id,
  null,
  ITEMS_DATA_V3[0].content.seller_id,
  ITEMS_DATA_V3[0].content.title,
  ITEMS_DATA_V3[0].content.description,
  undefined,
  null,
  ITEMS_DATA_V3[0].content.sale_price,
  ITEMS_DATA_V3[0].content.currency_code,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined,
  ITEMS_DATA_V3[0].content.flags,
  null,
  undefined,
  {
    id: '1',
    original_width: ITEMS_DATA_V3[0].content.image.original_width,
    original_height: ITEMS_DATA_V3[0].content.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEMS_DATA_V3[0].content.image,
  },
  undefined,
  ITEMS_DATA_V3[0].content.web_slug,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined,
  ITEM_TYPES.CONSUMER_GOODS,
  undefined,
  null,
  null,
  null,
  undefined
);

export const MOCK_ITEM_V3_2: Item = new Item(
  ITEMS_DATA_V3[1].content.id,
  null,
  ITEMS_DATA_V3[1].content.seller_id,
  ITEMS_DATA_V3[1].content.title,
  ITEMS_DATA_V3[1].content.description,
  undefined,
  null,
  ITEMS_DATA_V3[1].content.sale_price,
  ITEMS_DATA_V3[1].content.currency_code,
  ITEMS_DATA_V3[1].content.modified_date,
  undefined,
  ITEMS_DATA_V3[1].content.flags,
  null,
  undefined,
  {
    id: '2',
    original_width: ITEMS_DATA_V3[1].content.image.original_width,
    original_height: ITEMS_DATA_V3[1].content.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEMS_DATA_V3[1].content.image,
  },
  undefined,
  ITEMS_DATA_V3[1].content.web_slug,
  ITEMS_DATA_V3[1].content.modified_date,
  undefined,
  ITEM_TYPES.CONSUMER_GOODS,
  undefined,
  null,
  null,
  null,
  undefined
);

export const MOCK_ITEM_V3_3: Item = new Item(
  ITEMS_DATA_V3[0].content.id,
  null,
  ITEMS_DATA_V3[0].content.seller_id,
  ITEMS_DATA_V3[0].content.title,
  ITEMS_DATA_V3[0].content.description,
  14000,
  null,
  ITEMS_DATA_V3[0].content.sale_price,
  ITEMS_DATA_V3[0].content.currency_code,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined,
  ITEMS_DATA_V3[0].content.flags,
  null,
  undefined,
  {
    id: '1',
    original_width: ITEMS_DATA_V3[0].content.image.original_width,
    original_height: ITEMS_DATA_V3[0].content.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEMS_DATA_V3[0].content.image,
  },
  undefined,
  ITEMS_DATA_V3[0].content.web_slug,
  ITEMS_DATA_V3[0].content.modified_date,
  undefined
);

export const ITEMS_DATA_v3_FAVORITES = [
  {
    id: 'lqzmrdgogy6v',
    type: 'consumer_goods',
    content: {
      id: 'lqzmrdgogy6v',
      title: 'Ducati diavel',
      description: 'Hola vendo mi preciosa Ducati diavel \nCon 13.000km\nAño 2011\nExtras como',
      image: {
        original: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W1024',
        xsmall: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W320',
        small: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W320',
        large: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W800',
        medium: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W640',
        xlarge: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=386147626&pictureSize=W1024',
        original_width: 1024,
        original_height: 768,
      },
      user: {
        id: '9nz0g7kgrjok',
        micro_name: 'Sergio M.',
        image: {
          original: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
          xsmall: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W320',
          small: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W320',
          large: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
          medium: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
          xlarge: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=44934557&pictureSize=W640',
          original_width: 720,
          original_height: 1280,
        },
        online: false,
        kind: 'normal',
      },
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
      },
      visibility_flags: {
        bumped: false,
        highlighted: false,
        urgent: false,
        country_bumped: false,
      },
      price: 10000,
      currency: 'EUR',
      web_slug: 'ducati-diavel-172859908',
    },
  },
  {
    id: 'xpzppyk2xkz3',
    type: 'consumer_goods',
    content: {
      id: 'xpzppyk2xkz3',
      title: 'Ducati 175 TS-SPORT',
      description: 'Se vende ducati 175 TS-SPORT del año 1965 restaurada',
      image: {
        original: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
        xsmall: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W320',
        small: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W320',
        large: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
        medium: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
        xlarge: 'http://cdn-beta.wallapop.com/shnm-portlet/images?pictureId=355418054&pictureSize=W640',
        original_width: 447,
        original_height: 640,
      },
      user: {
        id: 'g0j232rpgd6y',
        micro_name: 'Alex S.',
        online: false,
        kind: 'normal',
      },
      flags: {
        pending: false,
        sold: false,
        reserved: false,
        banned: false,
        expired: false,
      },
      visibility_flags: {
        bumped: false,
        highlighted: false,
        urgent: false,
        country_bumped: false,
      },
      price: 3399,
      currency: 'EUR',
      web_slug: 'ducati-175-ts-sport-159670398',
    },
  },
];

export const CONVERSATION_USERS: ConversationUser[] = [
  {
    id: '1',
    micro_name: 'Jeff',
    last_message: 'Hola',
  },
  {
    id: '2',
    micro_name: 'Enric',
    last_message: 'Heyyyy',
  },
];

export const PURCHASES: Purchase[] = [
  {
    item_id: '1',
    expiration_date: 1510221655715,
    purchase_name: 'countrybump',
    visibility_flags: { bumped: false, highlighted: true, urgent: false },
  },
  {
    item_id: '2',
    expiration_date: 1510221346789,
    purchase_name: 'countrybump',
    visibility_flags: { bumped: false, highlighted: true, urgent: false },
  },
  {
    item_id: '3',
    expiration_date: 1509874085135,
    purchase_name: 'countrybump',
    visibility_flags: { bumped: true, highlighted: false, urgent: false },
  },
];

export const PRODUCT_DURATION_ID = 'l1kmzngg6n3p';
export const PRODUCT_DURATION_MARKET_CODE = 4.79;

export const PRODUCT_RESPONSE: Product = {
  id: 'd9ke65mjox1m',
  name: 'WEB-MARKET',
  default_duration_index: 0,
  durations: [
    {
      id: PRODUCT_DURATION_ID,
      duration: 168,
      market_code: PRODUCT_DURATION_MARKET_CODE.toString(),
      original_market_code: '5.99',
    },
  ],
};

export const PRODUCTS_RESPONSE: AvailableProductsResponse = {
  default_product_id: '1',
  products: [PRODUCT_RESPONSE],
};

export const PRODUCT2_RESPONSE: Product = {
  id: 'd9ke65mjox1m',
  name: 'WEB-MARKET',
  default_duration_index: 0,
  durations: [
    {
      id: 'g24g2jhg4jh24',
      duration: 168,
      market_code: '7.29',
      original_market_code: '5.99',
    },
  ],
};

export const ORDER: Order = {
  item_id: '1',
  product_id: '2',
};

export const ORDER_EVENT: OrderEvent = {
  order: [
    {
      item_id: ITEM_ID,
      product_id: PRODUCT_DURATION_ID,
    },
  ],
  total: PRODUCT_DURATION_MARKET_CODE,
};

export const UPLOAD_FORM_ITEM_VALUES: ItemUploadForm = {
  title: 'The title',
  description: 'The description',
  category_id: '12545',
  sale_price: 123.45,
  currency_code: 'EUR',
  sale_conditions: {
    fix_price: false,
    exchange_allowed: false,
    shipping_allowed: false,
  },
  location: {
    address: USER_LOCATION.title,
    latitude: USER_LOCATION.approximated_latitude,
    longitude: USER_LOCATION.approximated_longitude,
  },
  images: [{ image: true }],
};

export const UPLOAD_FORM_CAR_VALUES: CarUploadForm = {
  id: '',
  title: 'brand model year',
  storytelling: 'The description',
  model: 'model',
  brand: 'brand',
  year: 'year',
  version: 'version',
  financed_price: 123.45,
  num_seats: 4,
  num_doors: 3,
  body_type: 'body_type',
  km: 1000,
  engine: 'engine',
  gearbox: 'gearbox',
  horsepower: 100,
  category_id: CARS_CATEGORY,
  sale_price: 123.45,
  currency_code: 'EUR',
  sale_conditions: {
    fix_price: false,
    exchange_allowed: false,
    shipping_allowed: false,
  },
  images: [{ image: true }],
  location: {
    address: USER_LOCATION.title,
    latitude: USER_LOCATION.approximated_latitude,
    longitude: USER_LOCATION.approximated_longitude,
  },
};

export const UPLOAD_FORM_REALESTATE_VALUES: RealEstateUploadForm = {
  id: '',
  category_id: REALESTATE_CATEGORY,
  title: 'title',
  sale_price: 100,
  currency_code: 'EUR',
  storytelling: 'storytelling',
  operation: 'operation',
  type: 'type',
  condition: 'condition',
  surface: 100,
  rooms: 2,
  bathrooms: 2,
  garage: false,
  terrace: false,
  elevator: false,
  pool: false,
  garden: false,
  images: [{ image: true }],
  location: {
    address: USER_LOCATION.title,
    latitude: USER_LOCATION.approximated_latitude,
    longitude: USER_LOCATION.approximated_longitude,
    approximated_location: false,
  },
};

export const CITYBUMP_DURATIONS: Duration[] = [
  {
    id: 'p1k3zlq6xdyo',
    duration: 24,
    market_code: '3.19',
    original_market_code: '1.99',
  },
  {
    id: '2n08z8oj3wrq',
    duration: 72,
    market_code: '5.59',
    original_market_code: '6.99',
  },
  {
    id: 'd9ke65vmjox1',
    duration: 168,
    market_code: '7.19',
    original_market_code: '8.99',
  },
];

export const ZONEBUMP_DURATIONS: Duration[] = [
  {
    id: 'qpevjrwzk8y4',
    duration: 24,
    market_code: '3.19',
    original_market_code: '1.99',
  },
  {
    id: 'v9owzy2j5g7x',
    duration: 72,
    market_code: '3.19',
    original_market_code: '3.99',
  },
  {
    id: 'l1kmzngg6n3p',
    duration: 168,
    market_code: '4.79',
    original_market_code: '5.99',
  },
];

export const COUNTRYBUMP_DURATIONS: Duration[] = [
  {
    id: '5nv4z4ylzy73',
    duration: 24,
    market_code: '7.99',
    original_market_code: '9.99',
  },
  {
    id: '2y436edkjdgp',
    duration: 72,
    market_code: '15.19',
    original_market_code: '18.99',
  },
  {
    id: 'k87v6g05jeoy',
    duration: 168,
    market_code: '23.19',
    original_market_code: '28.99',
  },
];

export const BUMP_PRODUCTS: ProductDurations = {
  '24': {
    citybump: CITYBUMP_DURATIONS[0],
    zonebump: ZONEBUMP_DURATIONS[0],
    countrybump: COUNTRYBUMP_DURATIONS[0],
  },
  '72': {
    citybump: CITYBUMP_DURATIONS[1],
    zonebump: ZONEBUMP_DURATIONS[1],
    countrybump: COUNTRYBUMP_DURATIONS[1],
  },
  '168': {
    citybump: CITYBUMP_DURATIONS[2],
    zonebump: ZONEBUMP_DURATIONS[2],
    countrybump: COUNTRYBUMP_DURATIONS[2],
  },
};

export const BUMP_PRODUCTS_PROVINCE: ProductDurations = {
  '24': {
    zonebump: ZONEBUMP_DURATIONS[0],
    countrybump: COUNTRYBUMP_DURATIONS[0],
  },
  '72': {
    zonebump: ZONEBUMP_DURATIONS[1],
    countrybump: COUNTRYBUMP_DURATIONS[1],
  },
  '168': {
    zonebump: ZONEBUMP_DURATIONS[2],
    countrybump: COUNTRYBUMP_DURATIONS[2],
  },
};

export const ITEMS_WITH_PRODUCTS: ItemWithProducts[] = [
  {
    item: MOCK_ITEM_V3,
    products: BUMP_PRODUCTS,
  },
  {
    item: MOCK_ITEM_V3_2,
    products: BUMP_PRODUCTS,
  },
];

export const ITEMS_WITH_PRODUCTS_PROVINCE: ItemWithProducts[] = [
  {
    item: MOCK_ITEM_V3,
    products: BUMP_PRODUCTS_PROVINCE,
  },
  {
    item: MOCK_ITEM_V3_2,
    products: BUMP_PRODUCTS_PROVINCE,
  },
];

export const PRODUCT_LIST: Product[] = [
  {
    id: 'qvxpzp9630nd',
    name: 'citybump',
    default_duration_index: 1,
    durations: CITYBUMP_DURATIONS,
  },
  {
    id: 'l1kmzng6n3p8',
    name: 'zonebump',
    default_duration_index: 1,
    durations: ZONEBUMP_DURATIONS,
  },
  {
    id: 'gvdqjw4zon09',
    name: 'countrybump',
    default_duration_index: 1,
    durations: COUNTRYBUMP_DURATIONS,
  },
];

export const ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE: ItemsWithAvailableProductsResponse[] = [
  {
    id: '1',
    type: 'consumer_goods',
    content: ITEMS_DATA_V3[0].content,
    productList: PRODUCT_LIST,
  },
  {
    id: '2',
    type: 'consumer_goods',
    content: ITEMS_DATA_V3[1].content,
    productList: PRODUCT_LIST,
  },
];

export const CART_ITEM_CITYBUMP: CartItem = {
  item: new Item('1', 1, ITEMS_DATA_V3[1].content.seller_id),
  duration: CITYBUMP_DURATIONS[0],
};

export const CART_ITEM_CITYBUMP2: CartItem = {
  item: new Item('2', 2, ITEMS_DATA_V3[1].content.seller_id),
  duration: CITYBUMP_DURATIONS[1],
};

export const CART_ITEM_ZONEBUMP: CartItem = {
  item: new Item('3', 3, ITEMS_DATA_V3[1].content.seller_id),
  duration: ZONEBUMP_DURATIONS[0],
};

export const CART_ITEM_COUNTRYBUMP: CartItem = {
  item: new Item('4', 4, ITEMS_DATA_V3[1].content.seller_id),
  duration: COUNTRYBUMP_DURATIONS[0],
};

export const CART_ITEM_COUNTRYBUMP2: CartItem = {
  item: new Item('5', 5, ITEMS_DATA_V3[1].content.seller_id),
  duration: COUNTRYBUMP_DURATIONS[1],
};

export const CART_ORDER: Order[] = [
  {
    item_id: CART_ITEM_ZONEBUMP.item.id,
    product_id: CART_ITEM_ZONEBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_CITYBUMP.item.id,
    product_id: CART_ITEM_CITYBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_CITYBUMP2.item.id,
    product_id: CART_ITEM_CITYBUMP2.duration.id,
  },
  {
    item_id: CART_ITEM_COUNTRYBUMP.item.id,
    product_id: CART_ITEM_COUNTRYBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_COUNTRYBUMP2.item.id,
    product_id: CART_ITEM_COUNTRYBUMP2.duration.id,
  },
];

export const CART_ORDER_TRACK: any[] = [
  {
    item_id: CART_ITEM_ZONEBUMP.item.id,
    bump_type: CART_ITEM_ZONEBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_CITYBUMP.item.id,
    bump_type: CART_ITEM_CITYBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_CITYBUMP2.item.id,
    bump_type: CART_ITEM_CITYBUMP2.duration.id,
  },
  {
    item_id: CART_ITEM_COUNTRYBUMP.item.id,
    bump_type: CART_ITEM_COUNTRYBUMP.duration.id,
  },
  {
    item_id: CART_ITEM_COUNTRYBUMP2.item.id,
    bump_type: CART_ITEM_COUNTRYBUMP2.duration.id,
  },
];

export const ACTIONS_ALLOWED_CAN_MARK_SOLD_RESPONSE: AllowedActionResponse[] = [
  {
    type: 'chat',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'favorite',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'pay',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'report',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'delete',
    allowed: true,
  },
  {
    type: 'edit',
    allowed: true,
  },
  {
    type: 'mark_sold',
    allowed: true,
  },
  {
    type: 'reserve',
    allowed: true,
  },
  {
    type: 'share',
    allowed: true,
  },
  {
    type: 'reactivate',
    allowed: false,
    cause: 'item_not_expired',
  },
];

export const ACTIONS_ALLOWED_CANNOT_MARK_SOLD_RESPONSE: AllowedActionResponse[] = [
  {
    type: 'chat',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'favorite',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'pay',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'report',
    allowed: false,
    cause: 'item_is_mine',
  },
  {
    type: 'reserve',
    allowed: true,
  },
  {
    type: 'share',
    allowed: true,
  },
  {
    type: 'reactivate',
    allowed: false,
    cause: 'item_not_expired',
  },
];

export const MOCK_LISTING_FEE_ORDER: OrderEvent = {
  order: [{ item_id: 'p4w67gxww6xq', product_id: '5p4w67dy6xqo' }],
  total: 14.99,
};

export const MOCK_ITEM_RESPONSE_CONTENT: ItemContent = {
  id: MOCK_ITEM.id,
  category_id: MOCK_ITEM.categoryId,
  sale_price: MOCK_ITEM.salePrice,
  title: MOCK_ITEM.title,
  description: MOCK_ITEM.description,
  modified_date: MOCK_ITEM.modifiedDate,
  flags: MOCK_ITEM.flags,
  seller_id: 'ukd73df',
  web_slug: MOCK_ITEM.webSlug,
};
