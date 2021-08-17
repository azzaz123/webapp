import { APPLIANCES_FILTER_ID } from '../../../enums/filter-ids/appliances.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const APPLIANCES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    APPLIANCES_FILTER_ID.CATEGORIES,
    APPLIANCES_FILTER_ID.PRICE,
    APPLIANCES_FILTER_ID.OBJECT_TYPE,
    APPLIANCES_FILTER_ID.CONDITION,
    APPLIANCES_FILTER_ID.LOCATION,
  ],
  drawer: [
    APPLIANCES_FILTER_ID.CATEGORIES,
    APPLIANCES_FILTER_ID.PRICE,
    APPLIANCES_FILTER_ID.OBJECT_TYPE,
    APPLIANCES_FILTER_ID.CONDITION,
    APPLIANCES_FILTER_ID.LOCATION,
    APPLIANCES_FILTER_ID.POSTED_AGO,
  ],
};
