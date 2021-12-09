import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../../../enums/configuration-ids/consumer-goods-configuration-ids.enum';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from '@public/shared/components/filters/components/multi-select-filter/enum/multi-select-filter-bubble-variant.enum';

export const CONSUMER_GOODS_FILTERS: AvailableFilterConfig[] = [
  {
    id: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 20000],
    stepsConfig: [
      { range: [0, 50], step: 1 },
      { range: [50, 100], step: 5 },
      { range: [100, 300], step: 10 },
      { range: [300, 500], step: 50 },
      { range: [500, 1000], step: 100 },
      { range: [1000, 3000], step: 250 },
      { range: [3000, 5000], step: 500 },
      { range: [5000, 10000], step: 1000 },
      { range: [10000, 20000], step: 1250 },
    ],
    limitless: true,
  },
  {
    id: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.OBJECT_TYPE,
    type: FILTER_TYPES.MULTISELECT,
    title: $localize`:@@filters_view_all_users_subcategory_info_title:Subcategory`,
    bubblePlaceholder: $localize`:@@filter_by_subcategory_all_users_level_1_top_bar_title:Subcategory`,
    drawerPlaceholder: $localize`:@@filters_view_all_users_subcategory_info_select_label:Select subcategory`,
    icon: '/assets/icons/filters/subcategory.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
  },
];
