import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { ItemWithProducts, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { BumpsPackageBalanceDTO } from '@api/visibility/dtos/bumps/bumps-package-balance.interface';
import { Item } from '@core/item/item';
import { ItemContent, ItemsWithAvailableProductsResponse, Product } from '@core/item/item-response.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';

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
