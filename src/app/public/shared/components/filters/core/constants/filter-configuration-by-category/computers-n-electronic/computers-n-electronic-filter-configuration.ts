import { COMPUTERS_N_ELECTRONICS_FILTER_ID } from '../../../enums/filter-ids/computers-n-electronic.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const COMPUTERS_N_ELECTRONICS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    COMPUTERS_N_ELECTRONICS_FILTER_ID.CATEGORIES,
    COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE,
    COMPUTERS_N_ELECTRONICS_FILTER_ID.CONDITION,
  ],
  drawer: [
    COMPUTERS_N_ELECTRONICS_FILTER_ID.CATEGORIES,
    COMPUTERS_N_ELECTRONICS_FILTER_ID.PRICE,
    COMPUTERS_N_ELECTRONICS_FILTER_ID.CONDITION,
    COMPUTERS_N_ELECTRONICS_FILTER_ID.POSTED_AGO,
  ],
};
