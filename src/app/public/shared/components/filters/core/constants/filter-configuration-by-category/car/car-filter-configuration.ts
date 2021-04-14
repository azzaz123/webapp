import { CAR_FILTER_ID } from '../../../enums/filter-ids/cars.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const CAR_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [CAR_FILTER_ID.PRICE, CAR_FILTER_ID.PROFESSIONAL, CAR_FILTER_ID.YEAR, CAR_FILTER_ID.KM],
  drawer: [
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.KM,
    CAR_FILTER_ID.YEAR,
    CAR_FILTER_ID.WARRANTY,
    CAR_FILTER_ID.SEATS,
    CAR_FILTER_ID.DOORS,
    CAR_FILTER_ID.HORSE_POWER,
  ],
};
