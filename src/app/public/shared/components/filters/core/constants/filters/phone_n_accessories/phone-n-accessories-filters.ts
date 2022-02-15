import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { FILTER_QUERY_PARAM_KEY } from '../../../../enums/filter-query-param-key.enum';
import { PHONE_N_ACCESORIES_CONFIGURATION_ID } from '../../../enums/configuration-ids/phone-n-accessories-ids.enum';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from '@public/shared/components/filters/components/multi-select-filter/enum/multi-select-filter-bubble-variant.enum';

export const PHONE_N_ACCESSORIES_FILTERS: AvailableFilterConfig[] = [
  {
    id: PHONE_N_ACCESORIES_CONFIGURATION_ID.BRAND_MODEL,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@web_filter_phone_n_accessories_brand_title:Brand and model`,
    bubblePlaceholder: $localize`:@@web_filter_phone_n_accessories_brand_bubble_placeholder:Brand and model`,
    drawerPlaceholder: $localize`:@@web_filter_phone_n_accessories_brand_drawer_placeholder:Select brand and model`,
    suggesterPlaceholder: $localize`:@@web_filter_phone_n_accessories_brand_suggester_placeholder:Search brand and model`,
    icon: '/assets/icons/filters/phones_brand.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.brandModel,
    },
    hasOptionsOnInit: true,
    isClearable: true,
    hasContentPlaceholder: true,
    isLabelInValue: true,
  },
  {
    id: PHONE_N_ACCESORIES_CONFIGURATION_ID.OBJECT_TYPE,
    type: FILTER_TYPES.MULTISELECT,
    title: $localize`:@@web_filter_phone_n_accessories_type_title:Type of product`,
    bubblePlaceholder: $localize`:@@web_filter_phone_n_accessories_type_bubble_placeholder:Type of product`,
    drawerPlaceholder: $localize`:@@web_filter_phone_n_accessories_type_drawer_placeholder:Select type of product`,
    icon: '/assets/icons/filters/phones_type.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
  },
];
