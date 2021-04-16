import { REAL_ESTATE_FILTER_ID } from '../../../enums/filter-ids/real-estate/real-estate.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const REAL_ESTATE_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [REAL_ESTATE_FILTER_ID.PRICE],
  drawer: [REAL_ESTATE_FILTER_ID.PRICE],
};
