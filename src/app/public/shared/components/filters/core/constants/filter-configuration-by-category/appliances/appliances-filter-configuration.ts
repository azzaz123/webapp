import { APPLIANCES_FILTER_ID } from '../../../enums/filter-ids/appliances.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const APPLIANCES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [APPLIANCES_FILTER_ID.PRICE],
  drawer: [APPLIANCES_FILTER_ID.PRICE],
};
