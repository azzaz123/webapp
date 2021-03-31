import { REAL_ESTATE_FILTER_ID } from '../../../enums/filter-ids/real-estate/real-estate.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const REAL_ESTATE_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [REAL_ESTATE_FILTER_ID.PRICE],
  drawer: [REAL_ESTATE_FILTER_ID.PRICE],
};
