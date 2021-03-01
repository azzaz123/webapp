import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '../../../enums/configuration-ids/fashion-configuration-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '../../../enums/configuration-ids/real-estate-configuration-ids.enum';
import { FilterOption } from '../../../interfaces/filter-option.interface';
import { ConfigurationId } from '../../../types/configuration-id.type';

type HardcodedOptions = {
  [key in ConfigurationId]?: FilterOption[];
};

// TODO: This is currently in none of the modules. We need to launch i18n script when ready
// TODO: Icons will be added when specific filters are implemented so we can see them correctly

export const HARDCODED_OPTIONS: HardcodedOptions = {
  [COMMON_CONFIGURATION_ID.POSTED_AGO]: [
    {
      value: '24h',
      label: $localize`:@@FilterOptionPostedAgo_hours:Hours`,
    },
    {
      value: '7d',
      label: $localize`:@@FilterOptionPostedAgo_days:Days`,
    },
    {
      value: '30d',
      label: $localize`:@@FilterOptionPostedAgo_days:Days`,
    },
  ],
  [REAL_ESTATE_CONFIGURATION_ID.ROOMS]: [
    {
      value: '1',
    },
    {
      value: '2',
    },
    {
      value: '3',
    },
    {
      value: '4',
    },
  ],
  [REAL_ESTATE_CONFIGURATION_ID.BATHROOMS]: [
    {
      value: '1',
    },
    {
      value: '2',
    },
    {
      value: '3',
    },
    {
      value: '4',
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
