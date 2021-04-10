import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';

export const FASHION_FILTERS: AvailableFilterConfig[] = [
  {
    id: FASHION_CONFIGURATION_ID.GENDER,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@filterGenderTitle:Gender`,
    bubblePlaceholder: $localize`:@@filterGenderBubblePlaceholder:Gender`,
    drawerPlaceholder: $localize`:@@filterGenderBubblePlaceholder:Select gender`,
    mapKey: {
      parameterKey: 'gender',
    },
    hasContentPlaceholder: true,
    isClearable: true,
  },
];
