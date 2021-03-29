import {
  REAL_ESTATE_BUY_BOX_ROOM_FILTER_ID,
  REAL_ESTATE_BUY_DEFAULT_FILTER_ID,
  REAL_ESTATE_BUY_GARAGE_FILTER_ID,
  REAL_ESTATE_BUY_HOUSE_FILTER_ID,
  REAL_ESTATE_BUY_LAND_FILTER_ID,
  REAL_ESTATE_BUY_OFFICE_FILTER_ID,
  REAL_ESTATE_BUY_FLAT_FILTER_ID,
} from '../../../enums/filter-ids/real-estate/real-estate-buy.enum';

export const REAL_ESTATE_BUY_DEFAULT_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_DEFAULT_FILTER_ID.PRICE],
  drawer: [REAL_ESTATE_BUY_DEFAULT_FILTER_ID.PRICE],
};

export const REAL_ESTATE_BUY_HOUSE_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_HOUSE_FILTER_ID.PRICE, REAL_ESTATE_BUY_HOUSE_FILTER_ID.SURFACE],
  drawer: [REAL_ESTATE_BUY_HOUSE_FILTER_ID.PRICE, REAL_ESTATE_BUY_HOUSE_FILTER_ID.SURFACE],
};

export const REAL_ESTATE_BUY_FLAT_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_FLAT_FILTER_ID.PRICE, REAL_ESTATE_BUY_FLAT_FILTER_ID.SURFACE],
  drawer: [REAL_ESTATE_BUY_FLAT_FILTER_ID.PRICE, REAL_ESTATE_BUY_FLAT_FILTER_ID.SURFACE],
};

export const REAL_ESTATE_BUY_OFFICE_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_OFFICE_FILTER_ID.PRICE, REAL_ESTATE_BUY_OFFICE_FILTER_ID.SURFACE],
  drawer: [REAL_ESTATE_BUY_OFFICE_FILTER_ID.PRICE, REAL_ESTATE_BUY_OFFICE_FILTER_ID.SURFACE],
};

export const REAL_ESTATE_BUY_GARAGE_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_GARAGE_FILTER_ID.PRICE],
  drawer: [REAL_ESTATE_BUY_GARAGE_FILTER_ID.PRICE],
};

export const REAL_ESTATE_BUY_LAND_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_LAND_FILTER_ID.PRICE, REAL_ESTATE_BUY_LAND_FILTER_ID.SURFACE],
  drawer: [REAL_ESTATE_BUY_LAND_FILTER_ID.PRICE, REAL_ESTATE_BUY_LAND_FILTER_ID.SURFACE],
};

export const REAL_ESTATE_BUY_BOX_ROOM_FILTER_CONFIGURATION = {
  bubble: [REAL_ESTATE_BUY_BOX_ROOM_FILTER_ID.PRICE, REAL_ESTATE_BUY_BOX_ROOM_FILTER_ID.SURFACE],
  drawer: [REAL_ESTATE_BUY_BOX_ROOM_FILTER_ID.PRICE, REAL_ESTATE_BUY_BOX_ROOM_FILTER_ID.SURFACE],
};
