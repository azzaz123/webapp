import { COMPUTERS_N_ELECTRONICS_FILTER_ID } from '../../../enums/filter-ids/computers-n-electronic.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const COMPUTERS_N_ELECTRONICS_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE],
  drawer: [COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE],
};
