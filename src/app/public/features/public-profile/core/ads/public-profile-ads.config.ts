import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_SCREEN_SIZE,
  AD_TABLE_MAPPING,
} from '@core/ads/constants/ad-slots';
import { AdSlot } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export const PUBLIC_PROFILE_AD: AdSlot = {
  name: '130868815/web/user2',
  id: 'ad-unit-user-2',
  sizes: AD_DESKTOP_MAPPING,
  sizeMapping: {
    desktop: {
      screenSize: AD_DESKTOP_SCREEN_SIZE,
      mapping: AD_DESKTOP_MAPPING,
    },
    tablet: {
      screenSize: AD_TABLET_SCREEN_SIZE,
      mapping: AD_TABLE_MAPPING,
    },
    mobile: {
      screenSize: AD_MOBILE_SCREEN_SIZE,
      mapping: AD_MOBILE_MAPPING.big,
    },
  },
  networkId: 6866,
  type: 'user',
  device: [DeviceType.MOBILE],
};
