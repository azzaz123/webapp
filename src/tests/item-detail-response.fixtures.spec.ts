import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import {
  MOCK_ITEM_APROX_LOCATION,
  MOCK_ITEM_CAR,
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY,
  MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY,
  MOCK_ITEM_WITHOUT_COORDINATES,
  MOCK_ITEM_WITHOUT_LOCATION,
} from './item.fixtures.spec';
import { MOCK_USER, MOCK_USER_WITHOUT_LOCATION } from './user.fixtures.spec';

export const MOCK_ITEM_DETAIL_RESPONSE: ItemDetailResponse = {
  item: MOCK_ITEM_CAR,
  user: MOCK_USER,
};

export const MOCK_ITEM_DETAIL_RESPONSE_WITH_APROX_LOCATION: ItemDetailResponse = {
  item: MOCK_ITEM_APROX_LOCATION,
  user: MOCK_USER,
};

export const MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_LOCATION: ItemDetailResponse = {
  item: MOCK_ITEM_WITHOUT_LOCATION,
  user: MOCK_USER_WITHOUT_LOCATION,
};

export const MOCK_ITEM_DETAIL_RESPONSE_ITEM_WITHOUT_LOCATION: ItemDetailResponse = {
  item: MOCK_ITEM_WITHOUT_LOCATION,
  user: MOCK_USER,
};

export const MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_COORDINATES: ItemDetailResponse = {
  item: MOCK_ITEM_WITHOUT_COORDINATES,
  user: MOCK_USER,
};

export const MOCK_CELLPHONE_RESPONSE: ItemDetailResponse = {
  item: MOCK_ITEM_CELLPHONES,
  user: MOCK_USER,
};

export const MOCK_CELLPHONE_WITHOUT_SUBCATEGORY_RESPONSE: ItemDetailResponse = {
  item: MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY,
  user: MOCK_USER,
};

export const MOCK_CELLPHONE_PARENT_RESPONSE: ItemDetailResponse = {
  item: MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY,
  user: MOCK_USER,
};
