import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const FASHION_FILTERS: AvailableFilterConfig[] = [
  {
    id: FASHION_CONFIGURATION_ID.GENDER,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@web_filter_gender_title:Gender`,
    bubblePlaceholder: $localize`:@@web_filter_gender_bubble_placeholder:Gender`,
    drawerPlaceholder: $localize`:@@web_filter_gender_drawer_placeholder:Select gender`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gender,
    },
    hasContentPlaceholder: true,
    isClearable: true,
  },
  {
    id: FASHION_CONFIGURATION_ID.CLOTHING_TYPE,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@web_filter_clothing_type_title:Type of clothing`,
    bubblePlaceholder: $localize`:@@web_filter_clothing_type_bubble_placeholder:Type of clothing`,
    drawerPlaceholder: $localize`:@@web_filter_clothing_type_drawer_placeholder:Select type of clothing`,
    suggesterPlaceholder: $localize`:@@web_filter_clothing_type_suggester_placeholder:Search`,
    icon: '/assets/icons/filters/fashion_type.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    hasOptionsOnInit: true,
  },
  {
    id: FASHION_CONFIGURATION_ID.BRAND,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@web_filter_fashion_brand_title:Brand`,
    bubblePlaceholder: $localize`:@@web_filter_fashion_brand_bubble_placeholder:Brand`,
    drawerPlaceholder: $localize`:@@web_filter_fashion_brand_drawer_placeholder:Select brand`,
    suggesterPlaceholder: $localize`:@@web_filter_fashion_brand_suggester_placeholder:Search brand`,
    icon: '/assets/icons/filters/fashion_brand.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brand,
    },
    hasOptionsOnInit: true,
    isClearable: true,
    hasContentPlaceholder: true,
    isLabelInValue: true,
  },
];
