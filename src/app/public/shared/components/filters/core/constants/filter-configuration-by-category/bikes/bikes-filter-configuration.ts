import { BIKES_FILTER_ID } from '../../../enums/filter-ids/bikes.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const BIKES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [BIKES_FILTER_ID.PRICE],
  drawer: [BIKES_FILTER_ID.PRICE],
};
