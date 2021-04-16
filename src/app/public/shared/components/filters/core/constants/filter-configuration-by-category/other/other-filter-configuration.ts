import { OTHER_FILTER_ID } from '../../../enums/filter-ids/other.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const OTHER_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [OTHER_FILTER_ID.PRICE],
  drawer: [OTHER_FILTER_ID.PRICE],
};
