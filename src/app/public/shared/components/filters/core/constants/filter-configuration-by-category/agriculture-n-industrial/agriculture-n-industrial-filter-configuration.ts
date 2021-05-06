import { AGRICULTURE_FILTER_ID } from '../../../enums/filter-ids/agriculture-n-industrial.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [AGRICULTURE_FILTER_ID.CATEGORIES, AGRICULTURE_FILTER_ID.PRICE, AGRICULTURE_FILTER_ID.CONDITION],
  drawer: [
    AGRICULTURE_FILTER_ID.CATEGORIES,
    AGRICULTURE_FILTER_ID.PRICE,
    AGRICULTURE_FILTER_ID.CONDITION,
    AGRICULTURE_FILTER_ID.POSTED_AGO,
  ],
};
