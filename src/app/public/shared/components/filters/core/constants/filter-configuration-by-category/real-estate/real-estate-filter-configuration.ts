import {
  REAL_ESTATE_FILTER_ID,
  REAL_ESTATE_BOX_ROOM_FILTER_ID,
  REAL_ESTATE_FLAT_FILTER_ID,
  REAL_ESTATE_GARAGE_FILTER_ID,
  REAL_ESTATE_HOUSE_FILTER_ID,
  REAL_ESTATE_LAND_FILTER_ID,
  REAL_ESTATE_OFFICE_FILTER_ID,
  REAL_ESTATE_ROOM_FILTER_ID,
} from '../../../enums/filter-ids/real-estate/real-estate.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const REAL_ESTATE_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [REAL_ESTATE_FILTER_ID.CATEGORIES, REAL_ESTATE_FILTER_ID.OPERATION, REAL_ESTATE_FILTER_ID.TYPE, REAL_ESTATE_FILTER_ID.PRICE],
  drawer: [
    REAL_ESTATE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_FILTER_ID.OPERATION,
    REAL_ESTATE_FILTER_ID.TYPE,
    REAL_ESTATE_FILTER_ID.PRICE,
    REAL_ESTATE_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_FLAT_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_FLAT_FILTER_ID.CATEGORIES,
    REAL_ESTATE_FLAT_FILTER_ID.OPERATION,
    REAL_ESTATE_FLAT_FILTER_ID.TYPE,
    REAL_ESTATE_FLAT_FILTER_ID.PRICE,
    REAL_ESTATE_FLAT_FILTER_ID.SURFACE,
  ],
  drawer: [
    REAL_ESTATE_FLAT_FILTER_ID.CATEGORIES,
    REAL_ESTATE_FLAT_FILTER_ID.OPERATION,
    REAL_ESTATE_FLAT_FILTER_ID.TYPE,
    REAL_ESTATE_FLAT_FILTER_ID.PRICE,
    REAL_ESTATE_FLAT_FILTER_ID.SURFACE,
    REAL_ESTATE_FLAT_FILTER_ID.ROOMS,
    REAL_ESTATE_FLAT_FILTER_ID.BATHROOMS,
    REAL_ESTATE_FLAT_FILTER_ID.CONDITION,
    REAL_ESTATE_FLAT_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_HOUSE_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_HOUSE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_HOUSE_FILTER_ID.OPERATION,
    REAL_ESTATE_HOUSE_FILTER_ID.TYPE,
    REAL_ESTATE_HOUSE_FILTER_ID.PRICE,
    REAL_ESTATE_HOUSE_FILTER_ID.SURFACE,
  ],
  drawer: [
    REAL_ESTATE_HOUSE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_HOUSE_FILTER_ID.OPERATION,
    REAL_ESTATE_HOUSE_FILTER_ID.TYPE,
    REAL_ESTATE_HOUSE_FILTER_ID.PRICE,
    REAL_ESTATE_HOUSE_FILTER_ID.SURFACE,
    REAL_ESTATE_HOUSE_FILTER_ID.ROOMS,
    REAL_ESTATE_HOUSE_FILTER_ID.BATHROOMS,
    REAL_ESTATE_HOUSE_FILTER_ID.CONDITION,
    REAL_ESTATE_HOUSE_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_ROOM_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_ROOM_FILTER_ID.CATEGORIES,
    REAL_ESTATE_ROOM_FILTER_ID.OPERATION,
    REAL_ESTATE_ROOM_FILTER_ID.TYPE,
    REAL_ESTATE_ROOM_FILTER_ID.PRICE,
  ],
  drawer: [
    REAL_ESTATE_ROOM_FILTER_ID.CATEGORIES,
    REAL_ESTATE_ROOM_FILTER_ID.OPERATION,
    REAL_ESTATE_ROOM_FILTER_ID.TYPE,
    REAL_ESTATE_ROOM_FILTER_ID.PRICE,
    REAL_ESTATE_ROOM_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_OFFICE_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_OFFICE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_OFFICE_FILTER_ID.OPERATION,
    REAL_ESTATE_OFFICE_FILTER_ID.TYPE,
    REAL_ESTATE_OFFICE_FILTER_ID.PRICE,
    REAL_ESTATE_OFFICE_FILTER_ID.SURFACE,
  ],
  drawer: [
    REAL_ESTATE_OFFICE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_OFFICE_FILTER_ID.OPERATION,
    REAL_ESTATE_OFFICE_FILTER_ID.TYPE,
    REAL_ESTATE_OFFICE_FILTER_ID.PRICE,
    REAL_ESTATE_OFFICE_FILTER_ID.SURFACE,
    REAL_ESTATE_OFFICE_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_GARAGE_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_GARAGE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_GARAGE_FILTER_ID.OPERATION,
    REAL_ESTATE_GARAGE_FILTER_ID.TYPE,
    REAL_ESTATE_GARAGE_FILTER_ID.PRICE,
  ],
  drawer: [
    REAL_ESTATE_GARAGE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_GARAGE_FILTER_ID.OPERATION,
    REAL_ESTATE_GARAGE_FILTER_ID.TYPE,
    REAL_ESTATE_GARAGE_FILTER_ID.PRICE,
    REAL_ESTATE_GARAGE_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_LAND_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_LAND_FILTER_ID.CATEGORIES,
    REAL_ESTATE_LAND_FILTER_ID.OPERATION,
    REAL_ESTATE_LAND_FILTER_ID.TYPE,
    REAL_ESTATE_LAND_FILTER_ID.PRICE,
    REAL_ESTATE_LAND_FILTER_ID.SURFACE,
  ],
  drawer: [
    REAL_ESTATE_LAND_FILTER_ID.CATEGORIES,
    REAL_ESTATE_LAND_FILTER_ID.OPERATION,
    REAL_ESTATE_LAND_FILTER_ID.TYPE,
    REAL_ESTATE_LAND_FILTER_ID.PRICE,
    REAL_ESTATE_LAND_FILTER_ID.SURFACE,
    REAL_ESTATE_LAND_FILTER_ID.POSTED_AGO,
  ],
};

export const REAL_ESTATE_BOX_ROOM_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    REAL_ESTATE_BOX_ROOM_FILTER_ID.CATEGORIES,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.OPERATION,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.TYPE,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.PRICE,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.SURFACE,
  ],
  drawer: [
    REAL_ESTATE_BOX_ROOM_FILTER_ID.CATEGORIES,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.OPERATION,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.TYPE,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.PRICE,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.SURFACE,
    REAL_ESTATE_BOX_ROOM_FILTER_ID.POSTED_AGO,
  ],
};
