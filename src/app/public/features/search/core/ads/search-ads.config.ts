import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_DESKTOP_VERTICAL_MAPPING,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_MAPPING,
  AD_TABLET_SCREEN_SIZE,
} from '@core/ads/constants';
import { AdSlotConfiguration } from '@core/ads/models/ad-slot-configuration';
import { DeviceType } from '@core/device/deviceType.enum';

export interface AdSlotSearch {
  search1: AdSlotConfiguration;
  search2r: AdSlotConfiguration;
  search3r: AdSlotConfiguration;
}

export const AD_PUBLIC_SEARCH: AdSlotSearch = {
  search1: {
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
  },
  search2r: {
    name: '130868815/web/search2r',
    id: 'sky-unit-search-right-top',
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
    networkId: 6866,
    type: 'search',
    device: [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP],
  },
  search3r: {
    name: '130868815/web/search3r',
    id: 'sky-unit-search-right-bottom',
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
        mapping: AD_MOBILE_MAPPING.big,
      },
    },
    networkId: 6866,
    type: 'search',
    device: [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP],
  },
};
