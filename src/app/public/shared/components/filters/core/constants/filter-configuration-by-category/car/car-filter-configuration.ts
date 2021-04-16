import { CAR_FILTER_ID } from '../../../enums/filter-ids/cars.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';

export const CAR_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [
    COMMON_CONFIGURATION_ID.CATEGORIES,
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.PROFESSIONAL,
    CAR_FILTER_ID.BRAND_N_MODEL,
    CAR_FILTER_ID.YEAR,
    CAR_FILTER_ID.KM,
  ],
  drawer: [
    COMMON_CONFIGURATION_ID.CATEGORIES,
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
    COMMON_CONFIGURATION_ID.POSTED_AGO,
  ],
};
