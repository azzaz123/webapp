import { REAL_ESTATE_FILTER_ID } from '../../../enums/filter-ids/real-estate/real-estate.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const REAL_ESTATE_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [REAL_ESTATE_FILTER_ID.CATEGORIES, REAL_ESTATE_FILTER_ID.OPERATION, REAL_ESTATE_FILTER_ID.TYPE, REAL_ESTATE_FILTER_ID.PRICE],
  drawer: [
    REAL_ESTATE_FILTER_ID.CATEGORIES,
    REAL_ESTATE_FILTER_ID.OPERATION,
    REAL_ESTATE_FILTER_ID.TYPE,
    REAL_ESTATE_FILTER_ID.PRICE,
    REAL_ESTATE_FILTER_ID.POSTED_AGO,
  ],
};
