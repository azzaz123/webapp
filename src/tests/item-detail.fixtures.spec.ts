import { MOCK_CAR_EXTRA_INFO } from '@public/features/item-detail/core/services/map-extra-info/map-extra-info.fixtures.spec';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { ItemDetailLocation } from '@public/features/item-detail/pages/constants/item-detail.interface';
import { ItemTaxonomies } from '@public/features/item-detail/components/item-taxonomies/interfaces/item-taxonomies.interface';
import { of } from 'rxjs';
import { MOCK_COUNTER_SPECIFICATIONS_CAR } from './map-specifications.fixtures.spec';
import { MOCK_SOCIAL_SHARE } from './social-share.fixtures.spec';
import { MOCK_USER_STATS, MOCK_USER_WITHOUT_LOCATION } from './user.fixtures.spec';
import { Coordinate } from '@core/geolocation/address-response.interface';
import {
  MOCK_ITEM_APROX_LOCATION,
  MOCK_ITEM_CAR,
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY,
  MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY,
  MOCK_ITEM_WITHOUT_COORDINATES,
  MOCK_ITEM_WITHOUT_LOCATION,
} from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';

const MOCK_ITEM_DETAIL_LOCATION: ItemDetailLocation = {
  city: 'Barcelona',
  zip: '08027',
  latitude: 2323,
  longitude: 2323,
};

const MOCK_ITEM_DETAIL_COORDINATE: Coordinate = {
  latitude: 2323,
  longitude: 2323,
};

const MOCK_ITEM_TAXONOMIES: ItemTaxonomies = {
  parentTaxonomy: 'Parent Taxonomy',
  childTaxonomy: 'Chils Taxonomy',
  icon: 'path/icon',
};

const MOCK_ITEM_DETAIL_LOCATION_SPECIFICATIONS = '08027, Barcelona';

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

export const MOCK_CAR_ITEM_DETAIL: ItemDetail = {
  item: MOCK_ITEM_CAR,
  user: MOCK_USER,
  counterSpecifications: MOCK_COUNTER_SPECIFICATIONS_CAR,
  location: MOCK_ITEM_DETAIL_LOCATION,
  socialShare: MOCK_SOCIAL_SHARE,
  coordinate: MOCK_ITEM_DETAIL_COORDINATE,
  images: null,
  bigImages: null,
  userStats: of(MOCK_USER_STATS),
  extraInfo: MOCK_CAR_EXTRA_INFO,
  locationSpecifications: MOCK_ITEM_DETAIL_LOCATION_SPECIFICATIONS,
  taxonomiesSpecifications: of(MOCK_ITEM_TAXONOMIES),
  haveCoordinates: true,
  isApproximatedLocation: true,
  isItemACar: true,
  isItemAPhone: false,
  isAFashionItem: false,
};
