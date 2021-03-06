import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { PHONE_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/phones-n-accessories.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const PHONES_N_ACCESSORIES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    PHONE_N_ACCESSORIES_FILTER_ID.CATEGORIES,
    PHONE_N_ACCESSORIES_FILTER_ID.PRICE,
    PHONE_N_ACCESSORIES_FILTER_ID.OBJECT_TYPE,
    PHONE_N_ACCESSORIES_FILTER_ID.BRAND_N_MODEL,
    PHONE_N_ACCESSORIES_FILTER_ID.CONDITION,
    PHONE_N_ACCESSORIES_FILTER_ID.LOCATION,
  ],
  drawer: [
    PHONE_N_ACCESSORIES_FILTER_ID.CATEGORIES,
    PHONE_N_ACCESSORIES_FILTER_ID.PRICE,
    PHONE_N_ACCESSORIES_FILTER_ID.OBJECT_TYPE,
    PHONE_N_ACCESSORIES_FILTER_ID.BRAND_N_MODEL,
    PHONE_N_ACCESSORIES_FILTER_ID.CONDITION,
    PHONE_N_ACCESSORIES_FILTER_ID.LOCATION,
    PHONE_N_ACCESSORIES_FILTER_ID.POSTED_AGO,
  ],
  rules: {
    reload: [
      {
        parentParamKey: FILTER_QUERY_PARAM_KEY.objectType,
        childFilterConfigId: PHONE_N_ACCESSORIES_FILTER_ID.BRAND_N_MODEL,
      },
    ],
  },
};
