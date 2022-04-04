import { CATEGORY_IDS } from '@core/category/category-ids';
import { ItemResponse } from '@core/item/item-response.interface';

export const ITEM: ItemResponse = {
  id: '1',
  type: '',
  content: {
    id: '1',
    title: 'The title',
    description: 'The description',
    category_id: CATEGORY_IDS.APPLIANCES,
    seller_id: '1',
    flags: {
      favorite: true,
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    currency_code: 'EUR',
    modified_date: 1500545785245,
    url: 'url',
    images: [
      {
        id: '1',
        original_width: 100,
        original_height: 62,
        average_hex_color: '',
        urls_by_size: {
          original: '',
          small: '',
          large: '',
          medium: '',
          xlarge: '',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'web_slug',
  },
};

export const ITEM_WITH_REQUIRED_OBJECT_TYPE: ItemResponse = {
  id: '1',
  type: '',
  content: {
    id: '1',
    title: 'The title',
    description: 'The description',
    category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
    seller_id: '1',
    flags: {
      favorite: true,
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    currency_code: 'EUR',
    modified_date: 1500545785245,
    url: 'url',
    images: [
      {
        id: '1',
        original_width: 100,
        original_height: 62,
        average_hex_color: '',
        urls_by_size: {
          original: '',
          small: '',
          large: '',
          medium: '',
          xlarge: '',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'web_slug',
    extra_info: { object_type: { id: '1', name: '' }, brand: 'brand' },
  },
};

export const ITEM_WITH_REQUIRED_OBJECT_TYPE_LEVEL_2: ItemResponse = {
  id: '1',
  type: '',
  content: {
    id: '1',
    title: 'The title',
    description: 'The description',
    category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
    seller_id: '1',
    flags: {
      favorite: true,
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    currency_code: 'EUR',
    modified_date: 1500545785245,
    url: 'url',
    images: [
      {
        id: '1',
        original_width: 100,
        original_height: 62,
        average_hex_color: '',
        urls_by_size: {
          original: '',
          small: '',
          large: '',
          medium: '',
          xlarge: '',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'web_slug',
    extra_info: { object_type: { id: '1', name: '', parent_object_type: { id: '1', name: '' } }, brand: 'brand' },
  },
};

export const ITEM_WITH_REQUIRED_SIZE: ItemResponse = {
  id: '1',
  type: '',
  content: {
    id: '1',
    title: 'The title',
    description: 'The description',
    category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
    seller_id: '1',
    flags: {
      favorite: true,
      pending: false,
      sold: false,
      reserved: false,
      banned: false,
      expired: false,
    },
    sale_price: 123.45,
    currency_code: 'EUR',
    modified_date: 1500545785245,
    url: 'url',
    images: [
      {
        id: '1',
        original_width: 100,
        original_height: 62,
        average_hex_color: '',
        urls_by_size: {
          original: '',
          small: '',
          large: '',
          medium: '',
          xlarge: '',
        },
      },
    ],
    sale_conditions: {
      fix_price: false,
      exchange_allowed: false,
      shipping_allowed: false,
    },
    web_slug: 'web_slug',
    extra_info: { object_type: { id: '1', name: '' }, brand: 'brand', size: { id: '1' }, gender: 'gender' },
  },
};
