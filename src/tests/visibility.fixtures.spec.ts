import { BUMP_SERVICE_TYPE, BumpRequestSubject, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { Item } from '@core/item/item';

export const MOCK_ITEMS_TO_BUY_WITHOUT_FREE: SelectedProduct[] = [
  {
    item: new Item('id', 1, '1', 'new item'),
    productType: 'zonebump',
    duration: {
      id: '5p4w673yjxqo',
      duration: 360,
      market_code: '14.99',
      is_free: false,
    },
    isFree: false,
    isProvincialBump: false,
  },
  {
    item: new Item('id', 1, '1', 'new item'),
    productType: 'zonebump',
    duration: {
      id: '5p4w673yjxqo',
      duration: 360,
      market_code: '14.99',
      is_free: false,
    },
    isFree: false,
    isProvincialBump: false,
  },
];

export const MOCK_ITEMS_TO_BUY_FREE: SelectedProduct[] = [
  {
    item: new Item('id', 1, '1', 'new item'),
    productType: 'zonebump',
    duration: {
      id: '5p4w673yjxqo',
      duration: 360,
      market_code: '14.99',
      is_free: false,
    },
    isFree: true,
    isProvincialBump: false,
  },
  {
    item: new Item('id', 1, '1', 'new item'),
    productType: 'zonebump',
    duration: {
      id: '5p4w673yjxqo',
      duration: 360,
      market_code: '14.99',
      is_free: false,
    },
    isFree: true,
    isProvincialBump: false,
  },
];

export const MOCK_ERROR_FREE_BUMP_LIMITED_REACHED: BumpRequestSubject = {
  service: BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS,
  hasError: true,
  errorCode: 409,
};

export const MOCK_ERROR_FREE_BUMP_NOT_FOUND: BumpRequestSubject = {
  service: BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS,
  hasError: true,
  errorCode: 404,
};

export const MOCK_ERROR_FREE_BUMP_GENERIC: BumpRequestSubject = {
  service: BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS,
  hasError: true,
  errorCode: 500,
};

export const MOCK_ERROR_FREE_NOT_MAPPED: BumpRequestSubject = {
  service: BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS,
  hasError: true,
  errorCode: 400,
};

export const MOCK_ERROR_STRIPE: BumpRequestSubject = {
  service: BUMP_SERVICE_TYPE.STRIPE,
  hasError: true,
  error: 'error',
};
