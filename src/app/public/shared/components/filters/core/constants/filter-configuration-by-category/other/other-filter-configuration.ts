import { OTHER_FILTER_ID } from '../../../enums/filter-ids/other.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const OTHER_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [OTHER_FILTER_ID.PRICE],
  drawer: [OTHER_FILTER_ID.PRICE],
};
