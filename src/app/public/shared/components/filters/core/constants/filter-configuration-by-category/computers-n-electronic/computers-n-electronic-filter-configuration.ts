import { COMPUTERS_N_ELECTRONICS_FILTER_ID } from '../../../enums/filter-ids/computers-n-electronic.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const COMPUTERS_N_ELECTRONICS_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE],
  drawer: [COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE],
};
