import { APPLIANCES_FILTER_ID } from '../../../enums/filter-ids/appliances.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const APPLIANCES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [APPLIANCES_FILTER_ID.PRICE],
  drawer: [APPLIANCES_FILTER_ID.PRICE],
};
