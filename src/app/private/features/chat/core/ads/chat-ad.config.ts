import {
  AD_DESKTOP_SCREEN_SIZE,
  AD_DESKTOP_VERTICAL_MAPPING,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_SLOT_NETWORK_ID,
  AD_TABLET_MAPPING,
  AD_TABLET_SCREEN_SIZE,
} from '@core/ads/constants';
import { AdSlotConfiguration } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export const CHAT_AD_SLOTS: AdSlotConfiguration = {
  id: 'div-gpt-sky-1508490196308-0',
  name: '130868815/Desktop_Chat/Right',
  sizes: AD_DESKTOP_VERTICAL_MAPPING,
  sizeMapping: {
    desktop: {
      screenSize: AD_DESKTOP_SCREEN_SIZE,
      mapping: AD_DESKTOP_VERTICAL_MAPPING,
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
  networkId: AD_SLOT_NETWORK_ID,
  type: 'chat',
  device: [DeviceType.TABLET, DeviceType.DESKTOP],
};
