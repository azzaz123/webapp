import { OTHER_FILTER_ID } from '../../../enums/filter-ids/other.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const OTHER_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    OTHER_FILTER_ID.CATEGORIES,
    OTHER_FILTER_ID.PRICE,
    OTHER_FILTER_ID.OBJECT_TYPE,
    OTHER_FILTER_ID.CONDITION,
    OTHER_FILTER_ID.LOCATION,
  ],
  drawer: [
    OTHER_FILTER_ID.CATEGORIES,
    OTHER_FILTER_ID.PRICE,
    OTHER_FILTER_ID.OBJECT_TYPE,
    OTHER_FILTER_ID.CONDITION,
    OTHER_FILTER_ID.LOCATION,
    OTHER_FILTER_ID.POSTED_AGO,
  ],
};
