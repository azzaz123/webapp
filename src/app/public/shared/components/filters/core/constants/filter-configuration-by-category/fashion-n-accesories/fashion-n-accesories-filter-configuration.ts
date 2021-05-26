import { FASHION_FILTER_ID } from '../../../enums/filter-ids/fashion-n-accessories.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const FASHION_N_ACCESSORIES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    FASHION_FILTER_ID.CATEGORIES,
    FASHION_FILTER_ID.PRICE,
    FASHION_FILTER_ID.CLOTHING_TYPE,
    FASHION_FILTER_ID.BRAND,
    FASHION_FILTER_ID.GENDER,
    FASHION_FILTER_ID.SIZE,
    FASHION_FILTER_ID.CONDITION,
  ],
  drawer: [
    FASHION_FILTER_ID.CATEGORIES,
    FASHION_FILTER_ID.PRICE,
    FASHION_FILTER_ID.CLOTHING_TYPE,
    FASHION_FILTER_ID.BRAND,
    FASHION_FILTER_ID.GENDER,
    FASHION_FILTER_ID.SIZE,
    FASHION_FILTER_ID.CONDITION,
    FASHION_FILTER_ID.POSTED_AGO,
  ],
};
