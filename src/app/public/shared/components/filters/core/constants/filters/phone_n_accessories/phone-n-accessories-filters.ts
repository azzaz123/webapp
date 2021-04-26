import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { FILTER_QUERY_PARAM_KEY } from '../../../../enums/filter-query-param-key.enum';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';

export const PHONE_N_ACCESSORIES_FILTERS: AvailableFilterConfig[] = [
  {
    id: COMMON_CONFIGURATION_ID.BRAND_MODEL,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@filterPhoneNAccessoriesBrandTitle:Brand and model`,
    bubblePlaceholder: $localize`:@@filterPhoneNAccessoriesBrandBubblePlaceholder:Brand and model`,
    drawerPlaceholder: $localize`:@@filterPhoneNAccessoriesBrandDrawerPlaceholder:Select brand and model`,
    suggesterPlaceholder: $localize`:@@filterPhoneNAccessoriesBrandSuggesterPlaceholder:Search brand and model`,
    icon: '/assets/icons/filters/phones_brand.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brandModel,
    },
    hasOptionsOnInit: true,
    isClearable: true,
    hasContentPlaceholder: true,
  },
  {
    id: COMMON_CONFIGURATION_ID.OBJECT_TYPE,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@filterPhoneNAccessoriesTypeTitle:Type of product`,
    bubblePlaceholder: $localize`:@@filterPhoneNAccessoriesTypeBubblePlaceholder:Type of product`,
    drawerPlaceholder: $localize`:@@filterPhoneNAccessoriesTypeDrawerPlaceholder:Select type of product`,
    icon: '/assets/icons/filters/phones_type.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    isClearable: true,
    hasContentPlaceholder: true,
  },
];
