import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const FASHION_FILTERS: AvailableFilterConfig[] = [
  {
    id: FASHION_CONFIGURATION_ID.GENDER,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@filterGenderTitle:Gender`,
    bubblePlaceholder: $localize`:@@filterGenderBubblePlaceholder:Gender`,
    drawerPlaceholder: $localize`:@@filterGenderBubblePlaceholder:Select gender`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gender,
    },
    hasContentPlaceholder: true,
    isClearable: true,
  },
  {
    id: FASHION_CONFIGURATION_ID.CLOTHING_TYPE,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@filterClothingTypeTitle:Type of clothing`,
    bubblePlaceholder: $localize`:@@filterClothingTypeBubblePlaceholder:Type of clothing`,
    drawerPlaceholder: $localize`:@@filterClothingTypeDrawerPlaceholder:Select type of clothing`,
    suggesterPlaceholder: $localize`:@@filterClothingTypeSuggesterPlaceholder:Search`,
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
    title: $localize`:@@filterFashionBrandTitle:Brand`,
    bubblePlaceholder: $localize`:@@filterFashionBrandBubblePlaceholder:Brand`,
    drawerPlaceholder: $localize`:@@filterFashionBrandDrawerPlaceholder:Select brand`,
    suggesterPlaceholder: $localize`:@@filterFashionBrandSuggesterPlaceholder:Search brand`,
    icon: '/assets/icons/filters/fashion_brand.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brand,
    },
    hasOptionsOnInit: true,
    isClearable: true,
    hasContentPlaceholder: true,
  },
];
