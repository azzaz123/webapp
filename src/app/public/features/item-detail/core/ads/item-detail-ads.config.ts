import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_SCREEN_SIZE,
  AD_TABLET_MAPPING,
} from '@core/ads/constants/ad-slots';
import { AdSlot } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export const AD_TOP_ITEM_DETAIL: AdSlot = {
  name: '130868815/web/item1',
  id: 'ad-unit-item-top-1',
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
      mapping: AD_MOBILE_MAPPING.medium,
    },
  },
  networkId: 6866,
  type: 'item',
  device: [DeviceType.DESKTOP, DeviceType.TABLET, DeviceType.MOBILE],
};
