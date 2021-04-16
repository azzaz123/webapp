import { BIKES_FILTER_ID } from '../../../enums/filter-ids/bikes.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const BIKES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [BIKES_FILTER_ID.PRICE],
  drawer: [BIKES_FILTER_ID.PRICE],
};
