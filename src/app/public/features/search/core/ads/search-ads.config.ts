import { AdSlotConfiguration } from '@core/ads/models/ad-slot.interface';
import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_MAPPING,
  AD_TABLET_SCREEN_SIZE,
} from '@core/ads/constants';

import { DeviceType } from '@core/device/deviceType.enum';

export const AD_TOP_PUBLIC_SEARCH: AdSlotConfiguration = {
  name: '130868815/web/search1',
  id: 'sky-unit-search-top',
  sizes: AD_DESKTOP_MAPPING,
  sizeMapping: {
    desktop: {
      screenSize: AD_DESKTOP_SCREEN_SIZE,
      mapping: AD_DESKTOP_MAPPING,
    },
    tablet: {
      screenSize: AD_TABLET_SCREEN_SIZE,
      mapping: AD_TABLET_MAPPING,
    },
    mobile: {
      screenSize: AD_MOBILE_SCREEN_SIZE,
      mapping: AD_MOBILE_MAPPING.small,
    },
  },
  networkId: 6866,
  type: 'search',
  device: [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP],
};
