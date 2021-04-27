import {
  AD_DESKTOP_NATIVE_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_TABLET_SCREEN_SIZE,
  AD_MOBILE_SCREEN_SIZE,
  AD_MOBILE_NATIVE_MAPPING,
  AD_DESKTOP_NATIVE_WIDE_MAPPING,
  AD_MOBILE_NATIVE_WIDE_MAPPING,
} from '@core/ads/constants';
import { AdSlotConfiguration } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export interface AdsNativeSlotSearch {
  regular: AdSlotConfiguration;
  wide: AdSlotConfiguration;
}

export const ADS_NATIVE_SLOTS: AdsNativeSlotSearch = {
  regular: {
    id: 'sky-desktop-native-wall',
    name: '130868815/desktop_native_wall',
    sizes: AD_DESKTOP_NATIVE_MAPPING,
    sizeMapping: {
      desktop: {
        screenSize: AD_DESKTOP_SCREEN_SIZE,
        mapping: AD_DESKTOP_NATIVE_MAPPING,
      },
      tablet: {
        screenSize: AD_TABLET_SCREEN_SIZE,
        mapping: AD_DESKTOP_NATIVE_MAPPING,
      },
      mobile: {
        screenSize: AD_MOBILE_SCREEN_SIZE,
        mapping: AD_MOBILE_NATIVE_MAPPING,
      },
    },
    device: [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP],
    networkId: 1442702,
  },
  wide: {
    id: 'sky-desktop-native-wall-wide',
    name: '130868815/desktop_native_wall_wide',
    sizes: AD_DESKTOP_NATIVE_WIDE_MAPPING,
    sizeMapping: {
      desktop: {
        screenSize: AD_DESKTOP_SCREEN_SIZE,
        mapping: AD_DESKTOP_NATIVE_WIDE_MAPPING,
      },
      tablet: {
        screenSize: AD_TABLET_SCREEN_SIZE,
        mapping: AD_DESKTOP_NATIVE_WIDE_MAPPING,
      },
      mobile: {
        screenSize: AD_MOBILE_SCREEN_SIZE,
        mapping: AD_MOBILE_NATIVE_WIDE_MAPPING,
      },
    },
    device: [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP],
    networkId: 1481497,
  },
};
