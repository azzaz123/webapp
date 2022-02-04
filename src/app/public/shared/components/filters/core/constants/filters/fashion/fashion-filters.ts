import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from '@public/shared/components/filters/components/multi-select-filter/enum/multi-select-filter-bubble-variant.enum';
import { FASHION_BRAND_FILTER_OPTION_GROUP_ID } from '../../../enums/filter-option-group-ids/fashion/fashion-brand-filter-option-group-id';

export const FASHION_FILTERS: AvailableFilterConfig[] = [
  {
    id: FASHION_CONFIGURATION_ID.GENDER,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@web_filter_gender_title:Gender`,
    bubblePlaceholder: $localize`:@@web_filter_gender_bubble_placeholder:Gender`,
    drawerPlaceholder: $localize`:@@web_filter_gender_drawer_placeholder:Select gender`,
    icon: '/assets/icons/filters/gender.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gender,
    },
    hasContentPlaceholder: true,
    isClearable: true,
  },
  {
    id: FASHION_CONFIGURATION_ID.OBJECT_TYPE,
    type: FILTER_TYPES.MULTISELECT,
    title: $localize`:@@web_filter_clothing_type_title:Type of clothing`,
    bubblePlaceholder: $localize`:@@web_filter_clothing_type_bubble_placeholder:Type of clothing`,
    drawerPlaceholder: $localize`:@@web_filter_clothing_type_drawer_placeholder:Select type of clothing`,
    icon: '/assets/icons/filters/fashion_type.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
  },
  {
    id: FASHION_CONFIGURATION_ID.BRAND,
    type: FILTER_TYPES.MULTISELECT,
    title: $localize`:@@web_filter_fashion_brand_title:Brand`,
    bubblePlaceholder: $localize`:@@web_filter_fashion_brand_bubble_placeholder:Brand`,
    drawerPlaceholder: $localize`:@@web_filter_fashion_brand_drawer_placeholder:Select brand`,
    icon: '/assets/icons/filters/fashion_brand.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brand,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.SINGLE,
    singleBubbleValueLabel: $localize`:@@quick_filter_n_brands:${''}:INTERPOLATION:brands`,
    isSearchable: true,
    searchPlaceholder: $localize`:@@web_filter_fashion_brand_suggester_placeholder:Search brand`,
    hasValueAsLabel: true,
    optionGroupConfig: {
      [FASHION_BRAND_FILTER_OPTION_GROUP_ID.DEFAULT]: $localize`:@@suggester_brand_divider_all_brands:All the brands`,
      [FASHION_BRAND_FILTER_OPTION_GROUP_ID.COMMON]: $localize`:@@suggester_brand_divider_all_brands:All the brands`,
      [FASHION_BRAND_FILTER_OPTION_GROUP_ID.POPULAR]: $localize`:@@suggester_brand_divider_popular:Popular brands`,
    },
  },
  {
    id: FASHION_CONFIGURATION_ID.SIZE,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@web_filter_fashion_size_title:Size`,
    bubblePlaceholder: $localize`:@@web_filter_fashion_size_bubble_placeholder:Size`,
    drawerPlaceholder: $localize`:@@web_filter_fashion_size_drawer_placeholder:Select size`,
    icon: '/assets/icons/filters/size.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.size,
    },
    isClearable: true,
    hasContentPlaceholder: true,
  },
];
