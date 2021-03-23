import { MOCK_CAR_EXTRA_INFO } from '@public/features/item-detail/core/services/map-extra-info/map-extra-info.fixtures.spec';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { ItemDetailLocation } from '@public/features/item-detail/pages/constants/item-detail.interface';
import { ItemTaxonomies } from '@public/features/item-detail/components/item-taxonomies/interfaces/item-taxonomies.interface';
import { of } from 'rxjs';
import { MOCK_COUNTER_SPECIFICATIONS_CAR } from './map-specifications.fixtures.spec';
import { MOCK_SOCIAL_SHARE } from './social-share.fixtures.spec';
import { MOCK_USER_STATS, MOCK_USER_WITHOUT_LOCATION } from './user.fixtures.spec';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { MOCK_ITEM, MOCK_ITEM_CAR, MOCK_ITEM_FASHION, MOCK_ITEM_GBP, MOCK_ITEM_WITHOUT_LOCATION } from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { Item } from '@core/item/item';

const UNDEFINED_COPY = $localize`:@@Undefined:Undefined`;

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

export const MOCK_ITEM_DETAIL_GBP: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  item: MOCK_ITEM_GBP,
};

export const MOCK_CAR_ITEM_DETAIL_WITHOUT_COUNTER: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  counterSpecifications: null,
};

export const MOCK_CAR_ITEM_DETAIL_WITHOUT_SOCIAL_SHARE: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  socialShare: null,
};

export const MOCK_CAR_ITEM_DETAIL_WITH_VIEWS: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  item: getUserWithViewsAndFavourites(),
};

export const MOCK_ITEM_DETAIL_FASHION: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  item: MOCK_ITEM_FASHION,
  isItemACar: false,
};

export const MOCK_ITEM_DETAIL_WITHOUT_LOCATION: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  location: null,
  haveCoordinates: false,
  coordinate: null,
  locationSpecifications: UNDEFINED_COPY,
  item: MOCK_ITEM_WITHOUT_LOCATION,
  user: MOCK_USER_WITHOUT_LOCATION,
};

export const MOCK_ITEM_DETAIL_WITHOUT_EXTRA_INFO: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  extraInfo: null,
};

export const MOCK_ITEM_DETAIL_WITHOUT_TAXONOMIES: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  taxonomiesSpecifications: of(),
};

export const MOCK_ITEM_DETAIL_WITHOUT_ITEM: ItemDetail = {
  ...MOCK_CAR_ITEM_DETAIL,
  item: null,
};

function getUserWithViewsAndFavourites(): Item {
  const item = MOCK_ITEM;
  item.favorites = 3;
  item.views = 5;
  return item;
}
