import { BIKES_FILTER_ID } from '../../../enums/filter-ids/bikes.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const BIKES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    BIKES_FILTER_ID.CATEGORIES,
    BIKES_FILTER_ID.PRICE,
    BIKES_FILTER_ID.OBJECT_TYPE,
    BIKES_FILTER_ID.CONDITION,
    BIKES_FILTER_ID.LOCATION,
  ],
  drawer: [
    BIKES_FILTER_ID.CATEGORIES,
    BIKES_FILTER_ID.PRICE,
    BIKES_FILTER_ID.OBJECT_TYPE,
    BIKES_FILTER_ID.CONDITION,
    BIKES_FILTER_ID.LOCATION,
    BIKES_FILTER_ID.POSTED_AGO,
  ],
};
