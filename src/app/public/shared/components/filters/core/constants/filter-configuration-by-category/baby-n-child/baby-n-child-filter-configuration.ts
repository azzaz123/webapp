import { BABY_N_CHILD_FILTER_ID } from '../../../enums/filter-ids/baby-n-child.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const BABY_N_CHILD_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    BABY_N_CHILD_FILTER_ID.CATEGORIES,
    BABY_N_CHILD_FILTER_ID.PRICE,
    BABY_N_CHILD_FILTER_ID.OBJECT_TYPE,
    BABY_N_CHILD_FILTER_ID.CONDITION,
    BABY_N_CHILD_FILTER_ID.LOCATION,
  ],
  drawer: [
    BABY_N_CHILD_FILTER_ID.CATEGORIES,
    BABY_N_CHILD_FILTER_ID.PRICE,
    BABY_N_CHILD_FILTER_ID.OBJECT_TYPE,
    BABY_N_CHILD_FILTER_ID.CONDITION,
    BABY_N_CHILD_FILTER_ID.LOCATION,
    BABY_N_CHILD_FILTER_ID.POSTED_AGO,
  ],
};
