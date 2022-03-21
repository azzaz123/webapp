import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { DurationMapped, ItemsBySubscription, ItemWithProducts, ProductMapped } from '@api/core/model/bumps/item-products.interface';
import { BumpsPackageBalanceDTO } from '@api/visibility/dtos/bumps/bumps-package-balance.interface';
import { Item } from '@core/item/item';
import { ItemContent, ItemsWithAvailableProductsResponse, Product } from '@core/item/item-response.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED } from '@fixtures/subscriptions.fixtures.spec';

export const MOCK_BUMPS_PACKAGE_BALANCE: BumpsPackageBalanceDTO[] = [
  {
    subscription_type: 'MOTORBIKES',
    category_ids: [14000],
    balance: [
      {
        type: 'zonebump',
        duration_days: 2,
        total: 5,
        used: 3,
      },
      {
        type: 'countrybump',
        duration_days: 2,
        total: 100,
        used: 90,
      },
    ],
  },
  {
    subscription_type: 'CONSUMERGOODS',
    category_ids: [13100, 12461, 17000, 16000, 18000, 15000, 19000, 12465, 12900, 12467, 12463, 12485, 12579, 12545, 13200, 20000, 21000],
    balance: [
      {
        type: 'zonebump',
        duration_days: 2,
        total: 9,
        used: 2,
      },
    ],
  },
];

export const MOCK_BUMPS_PACKAGE_BALANCE_MAPPED: BumpsPackageBalance[] = [
  {
    subscription_type: SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES,
    category_ids: [14000],
    balance: [
      {
        type: BUMP_TYPE.ZONE_BUMP,
        duration_days: 2,
        total: 5,
        used: 3,
      },
      {
        type: BUMP_TYPE.COUNTRY_BUMP,
        duration_days: 2,
        total: 100,
        used: 90,
      },
    ],
  },
  {
    subscription_type: SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS,
    category_ids: [13100, 12461, 17000, 16000, 18000, 15000, 19000, 12465, 12900, 12467, 12463, 12485, 12579, 12545, 13200, 20000, 21000],
    balance: [
      {
        type: BUMP_TYPE.ZONE_BUMP,
        duration_days: 2,
        total: 9,
        used: 2,
      },
    ],
  },
];

const ITEM_1: ItemContent = {
  id: '9nz077eg3djo',
  title: 'Alpine A110 2021',
  description:
    'Brand: Alpine\nModel: A110 1.8 252 Pure 2p Aut.\nYear: 2021\nGear Box: Manual\nBody Type: Coupe\nNúmero de asientos: 2\nNumber of doors: 2\n252.0 CV\n',
  category_id: 100,
  image: {
    original: 'http://cdn-beta.wallapop.com/images/10420/35/qj/__/c10420p191034803/i422110106.jpg?pictureSize=W1024',
    small: 'http://cdn-beta.wallapop.com/images/10420/35/qj/__/c10420p191034803/i422110106.jpg?pictureSize=W320',
    large: 'http://cdn-beta.wallapop.com/images/10420/35/qj/__/c10420p191034803/i422110106.jpg?pictureSize=W800',
    medium: 'http://cdn-beta.wallapop.com/images/10420/35/qj/__/c10420p191034803/i422110106.jpg?pictureSize=W640',
    xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/qj/__/c10420p191034803/i422110106.jpg?pictureSize=W1024',
    original_width: 780,
    original_height: 439,
  },
  seller_id: 'mxzodxk0llj9',
  flags: {
    pending: false,
    sold: false,
    reserved: false,
    banned: false,
    expired: false,
    bumped: false,
    highlighted: false,
    urgent: false,
    onhold: false,
  },
  sale_price: 2000,
  currency_code: 'EUR',
  modified_date: 1638364006000,
  publish_date: 1636997249000,
  web_slug: 'alpine-a110-2021-191034803',
  views: 5,
  favorites: 1,
  conversations: 0,
};

const ITEM_1_MAPPED: Item = new Item(
  ITEM_1.id,
  null,
  null,
  ITEM_1.title,
  ITEM_1.description,
  ITEM_1.category_id,
  null,
  ITEM_1.sale_price,
  ITEM_1.currency_code,
  ITEM_1.modified_date,
  ITEM_1.url,
  ITEM_1.flags,
  null,
  ITEM_1.sale_conditions,
  {
    id: ITEM_1.id,
    original_width: ITEM_1.image.original_width,
    original_height: ITEM_1.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEM_1.image,
  },
  ITEM_1.images,
  ITEM_1.web_slug,
  ITEM_1.publish_date
);

const PRODUCT_LIST: Product[] = [
  {
    id: 'l1kmzng6n3p8',
    name: 'zonebump',
    default_duration_index: 1,
    durations: [
      { id: 'l1kmzngg6n3p', duration: 168, market_code: '8.99', is_free: false },
      { id: '5p4w673yjxqo', duration: 360, market_code: '14.99', is_free: false },
      { id: 'g9kp61v565l3', duration: 720, market_code: '16.99', is_free: false },
    ],
  },
  {
    id: 'qvxpzp9630nd',
    name: 'citybump',
    features: ['slider'],
    location_name: 'Barcelona',
    default_duration_index: 1,
    durations: [
      { id: 'd9ke65vmjox1', duration: 168, market_code: '11.99', is_free: false },
      { id: 'gvdqjwe4jon0', duration: 360, market_code: '19.99', is_free: false },
      { id: 'dwlqzm9o6vm9', duration: 720, market_code: '24.99', is_free: false },
    ],
  },
  {
    id: 'gvdqjw4zon09',
    name: 'countrybump',
    default_duration_index: 1,
    durations: [
      { id: 'k87v6g05jeoy', duration: 168, market_code: '24.99', is_free: false },
      { id: '3e9wzvr76lmd', duration: 360, market_code: '34.99', is_free: false },
    ],
  },
];

const ITEM_2: ItemContent = {
  id: '4w67qqpg19zx',
  title: 'biciclet',
  description: 'AAA',
  category_id: 17000,
  image: {
    original: 'http://cdn-beta.wallapop.com/images/10420/35/pd/__/c10420p190980804/i422214104.jpg?pictureSize=W1024',
    small: 'http://cdn-beta.wallapop.com/images/10420/35/pd/__/c10420p190980804/i422214104.jpg?pictureSize=W320',
    large: 'http://cdn-beta.wallapop.com/images/10420/35/pd/__/c10420p190980804/i422214104.jpg?pictureSize=W800',
    medium: 'http://cdn-beta.wallapop.com/images/10420/35/pd/__/c10420p190980804/i422214104.jpg?pictureSize=W640',
    xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/pd/__/c10420p190980804/i422214104.jpg?pictureSize=W1024',
    original_width: 284,
    original_height: 177,
  },
  seller_id: 'mxzodxk0llj9',
  flags: {
    pending: false,
    sold: false,
    reserved: false,
    banned: false,
    expired: false,
    bumped: false,
    highlighted: false,
    urgent: false,
    onhold: false,
  },
  sale_price: 200,
  currency_code: 'EUR',
  modified_date: 1638266137000,
  publish_date: 1636543725000,
  web_slug: 'biciclet-190980804',
  views: 11,
  favorites: 0,
  conversations: 0,
};

const ITEM_2_MAPPED: Item = new Item(
  ITEM_2.id,
  null,
  null,
  ITEM_2.title,
  ITEM_2.description,
  ITEM_2.category_id,
  null,
  ITEM_2.sale_price,
  ITEM_2.currency_code,
  ITEM_2.modified_date,
  ITEM_2.url,
  ITEM_2.flags,
  null,
  ITEM_2.sale_conditions,
  {
    id: ITEM_2.id,
    original_width: ITEM_2.image.original_width,
    original_height: ITEM_2.image.original_height,
    average_hex_color: '',
    urls_by_size: ITEM_2.image,
  },
  ITEM_2.images,
  ITEM_2.web_slug,
  ITEM_2.publish_date
);

const PRODUCT_LIST_WITHOUT_CITY: Product[] = [
  {
    id: 'l1kmzng6n3p8',
    name: 'zonebump',
    default_duration_index: 1,
    durations: [
      { id: 'qvxpzp99630n', duration: 48, market_code: '2.99', is_free: false },
      { id: 'l1kmzngg6n3p', duration: 168, market_code: '5.99', is_free: false },
      { id: '5p4w673yjxqo', duration: 360, market_code: '9.99', is_free: false },
    ],
  },
  {
    id: 'gvdqjw4zon09',
    name: 'countrybump',
    default_duration_index: 1,
    durations: [
      { id: 'qpevjrkwzk8y', duration: 48, market_code: '7.99', is_free: false },
      { id: 'k87v6g05jeoy', duration: 168, market_code: '16.99', is_free: false },
      { id: '3e9wzvr76lmd', duration: 360, market_code: '29.99', is_free: false },
    ],
  },
];

const ITEM_WITH_PRODUCTS_1: ItemsWithAvailableProductsResponse = {
  id: '9nz077eg3djo',
  type: 'cars',
  content: ITEM_1,
  productList: PRODUCT_LIST_WITHOUT_CITY,
};

const ITEM_WITH_PRODUCTS_2: ItemsWithAvailableProductsResponse = {
  id: '4w67qqpg19zx',
  type: 'consumer_goods',
  content: ITEM_2,
  productList: PRODUCT_LIST,
};

export const DURATION_LIST_FREE_BUMPS_MAPPED: DurationMapped[] = [
  {
    ...PRODUCT_LIST[0].durations[0],
    isFreeOption: true,
  },
  {
    ...PRODUCT_LIST[0].durations[1],
    isFreeOption: false,
  },
  {
    ...PRODUCT_LIST[0].durations[2],
    isFreeOption: false,
  },
];

export const DURATION_LIST_FREE_BUMPS_WITHOUT_PRODUCT_MAPPED: DurationMapped[] = [
  {
    ...PRODUCT_LIST[0].durations[1],
    isFreeOption: false,
  },
  {
    ...PRODUCT_LIST[0].durations[2],
    isFreeOption: false,
  },
  {
    id: null,
    duration: 48,
    market_code: null,
    isFreeOption: true,
  },
];

export const ITEMS_WITH_AVAILABLE_PRODUCTS_RESPONSE: ItemsWithAvailableProductsResponse[] = [ITEM_WITH_PRODUCTS_1, ITEM_WITH_PRODUCTS_2];

export const ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED: ItemWithProducts[] = [
  {
    item: ITEM_1_MAPPED,
    products: PRODUCT_LIST_WITHOUT_CITY,
    isProvincialBump: true,
    subscription: null,
  },
  {
    isProvincialBump: false,
    item: ITEM_2_MAPPED,
    products: PRODUCT_LIST,
    subscription: null,
  },
];

export const ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_MAPPED: ItemWithProducts = {
  item: ITEM_1_MAPPED,
  products: [
    ...PRODUCT_LIST,
    {
      ...PRODUCT_LIST[0],
      durations: DURATION_LIST_FREE_BUMPS_MAPPED,
    },
  ],
  isProvincialBump: true,
  subscription: MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0],
};

export const ITEMS_WITH_AVAILABLE_PRODUCTS_FREE_BUMPS_NO_PRODUCTS_MAPPED: ItemWithProducts = {
  item: ITEM_1_MAPPED,
  products: [
    {
      ...PRODUCT_LIST[0],
      durations: DURATION_LIST_FREE_BUMPS_WITHOUT_PRODUCT_MAPPED,
    },
  ],
  isProvincialBump: true,
  subscription: MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0],
};

export const ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED_BY_SUBSCRIPTION_NO_SUB: ItemsBySubscription[] = [
  {
    subscription: null,
    items: ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED,
    availableFreeBumps: null,
  },
];
