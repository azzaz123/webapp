import { CAR_FILTER_ID } from '../../../enums/filter-ids/cars.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const CAR_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    CAR_FILTER_ID.CATEGORIES,
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.PROFESSIONAL,
    CAR_FILTER_ID.BRAND_N_MODEL,
    CAR_FILTER_ID.YEAR,
    CAR_FILTER_ID.KM,
    CAR_FILTER_ID.LOCATION,
  ],
  drawer: [
    CAR_FILTER_ID.CATEGORIES,
    CAR_FILTER_ID.BRAND_N_MODEL,
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.KM,
    CAR_FILTER_ID.YEAR,
    CAR_FILTER_ID.SEATS,
    CAR_FILTER_ID.DOORS,
    CAR_FILTER_ID.HORSE_POWER,
    CAR_FILTER_ID.BODY,
    CAR_FILTER_ID.ENGINE,
    CAR_FILTER_ID.GEARBOX,
    CAR_FILTER_ID.WARRANTY,
    CAR_FILTER_ID.LOCATION,
    CAR_FILTER_ID.POSTED_AGO,
  ],
};
