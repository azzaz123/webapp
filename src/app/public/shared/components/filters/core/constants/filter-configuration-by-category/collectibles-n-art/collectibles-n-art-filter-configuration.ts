import { COLLECTIBLES_N_ART_FILTER_ID } from '../../../enums/filter-ids/collectibles-n-art.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const COLLECTIBLES_N_ART_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [COLLECTIBLES_N_ART_FILTER_ID.CATEGORIES, COLLECTIBLES_N_ART_FILTER_ID.PRICE, COLLECTIBLES_N_ART_FILTER_ID.CONDITION],
  drawer: [
    COLLECTIBLES_N_ART_FILTER_ID.CATEGORIES,
    COLLECTIBLES_N_ART_FILTER_ID.PRICE,
    COLLECTIBLES_N_ART_FILTER_ID.CONDITION,
    COLLECTIBLES_N_ART_FILTER_ID.POSTED_AGO,
  ],
};
