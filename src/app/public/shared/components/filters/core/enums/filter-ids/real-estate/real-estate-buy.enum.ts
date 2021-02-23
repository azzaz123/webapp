import { COMMON_FILTERS } from '../common.enum';
import { REAL_ESTATE_COMMON, REAL_ESTATE_SURFACES_BY_TYPE } from './real-estate-common.enum';

export enum REAL_ESTATE_BUY_DEFAULT_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-default-price',
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}

export enum REAL_ESTATE_BUY_HOUSE_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-house-price',
  SURFACE = REAL_ESTATE_SURFACES_BY_TYPE.HOUSE,
  LOCATION = COMMON_FILTERS.LOCATION,
  EXTRAS = REAL_ESTATE_COMMON.EXTRAS,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
  ROOMS = REAL_ESTATE_COMMON.ROOMS,
  BATHROOMS = REAL_ESTATE_COMMON.BATHROOMS,
}

export enum REAL_ESTATE_BUY_FLAT_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-flat-price',
  SURFACE = REAL_ESTATE_SURFACES_BY_TYPE.FLAT,
  LOCATION = COMMON_FILTERS.LOCATION,
  EXTRAS = REAL_ESTATE_COMMON.EXTRAS,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
  ROOMS = REAL_ESTATE_COMMON.ROOMS,
  BATHROOMS = REAL_ESTATE_COMMON.BATHROOMS,
}

export enum REAL_ESTATE_BUY_OFFICE_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-office-price',
  SURFACE = REAL_ESTATE_SURFACES_BY_TYPE.OFFICE,
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}

export enum REAL_ESTATE_BUY_GARAGE_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-garage-price',
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}

export enum REAL_ESTATE_BUY_LAND_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-land-price',
  SURFACE = REAL_ESTATE_SURFACES_BY_TYPE.LAND,
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}

export enum REAL_ESTATE_BUY_BOX_ROOM {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-buy-box_room-price',
  SURFACE = REAL_ESTATE_SURFACES_BY_TYPE.BOX_ROOM,
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}
