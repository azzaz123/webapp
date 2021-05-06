import { COMMON_CONFIGURATION_ID } from '../../../components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '../../../components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '../../../components/filters/core/enums/configuration-ids/real-estate-configuration-ids.enum';
import { FilterOption } from '../../../components/filters/core/interfaces/filter-option.interface';
import { ConfigurationId } from '../../../components/filters/core/types/configuration-id.type';
import { POSTED_AGO } from './posted-ago.enum';

type HardcodedOptions = {
  [key in ConfigurationId]?: FilterOption[];
};

// TODO: This is currently in none of the modules. We need to launch i18n script when ready
// TODO: Icons will be added when specific filters are implemented so we can see them correctly

export const HARDCODED_OPTIONS: HardcodedOptions = {
  [COMMON_CONFIGURATION_ID.POSTED_AGO]: [
    {
      value: POSTED_AGO.TODAY,
      label: $localize`:@@FilterOptionPostedAgo_hours:Hours`,
      icon: '/assets/icons/filters/options/24.svg',
    },
    {
      value: POSTED_AGO.LAST_WEEK,
      label: $localize`:@@FilterOptionPostedAgo_days:Days`,
      icon: '/assets/icons/filters/options/7.svg',
    },
    {
      value: POSTED_AGO.LAST_MONTH,
      label: $localize`:@@FilterOptionPostedAgo_days:Days`,
      icon: '/assets/icons/filters/options/30.svg',
    },
  ],
  [REAL_ESTATE_CONFIGURATION_ID.ROOMS]: [
    {
      value: '1',
      label: '',
      icon: '/assets/icons/filters/options/1.svg',
    },
    {
      value: '2',
      label: '',
      icon: '/assets/icons/filters/options/2.svg',
    },
    {
      value: '3',
      label: '',
      icon: '/assets/icons/filters/options/3.svg',
    },
    {
      value: '4',
      label: '',
      icon: '/assets/icons/filters/options/4+.svg',
    },
  ],
  [REAL_ESTATE_CONFIGURATION_ID.BATHROOMS]: [
    {
      value: '1',
      label: '',
      icon: '/assets/icons/filters/options/1.svg',
    },
    {
      value: '2',
      label: '',
      icon: '/assets/icons/filters/options/2.svg',
    },
    {
      value: '3',
      label: '',
      icon: '/assets/icons/filters/options/3.svg',
    },
    {
      value: '4',
      label: '',
      icon: '/assets/icons/filters/options/4+.svg',
    },
  ],
  [FASHION_CONFIGURATION_ID.GENDER]: [
    {
      value: 'male',
      label: $localize`:@@FilterOptionGender_male:Male`,
    },
    {
      value: 'female',
      label: $localize`:@@FilterOptionGender_female:Female`,
    },
  ],
};
