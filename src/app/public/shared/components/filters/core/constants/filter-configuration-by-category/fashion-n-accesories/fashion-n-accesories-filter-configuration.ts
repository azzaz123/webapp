import { FASHION_FILTER_ID } from '../../../enums/filter-ids/fashion-n-accessories.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const FASHION_N_ACCESSORIES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [
    FASHION_FILTER_ID.CATEGORIES,
    FASHION_FILTER_ID.PRICE,
    FASHION_FILTER_ID.OBJECT_TYPE,
    FASHION_FILTER_ID.BRAND,
    FASHION_FILTER_ID.CONDITION,
  ],
  drawer: [
    FASHION_FILTER_ID.CATEGORIES,
    FASHION_FILTER_ID.PRICE,
    FASHION_FILTER_ID.OBJECT_TYPE,
    FASHION_FILTER_ID.BRAND,
    FASHION_FILTER_ID.CONDITION,
    FASHION_FILTER_ID.POSTED_AGO,
  ],
};
