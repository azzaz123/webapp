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
  topBanner: AdSlotConfiguration;
  pos1Right: AdSlotConfiguration;
  pos2Right: AdSlotConfiguration;
  mobileTopBanner: AdSlotConfiguration;
  mobilePos1: AdSlotConfiguration;
  mobilePos2: AdSlotConfiguration;
}

export const AD_PUBLIC_SEARCH: AdSlotSearch = {
  topBanner: {
    name: '130868815/Desktop_Search/Topbanner',
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
    device: [DeviceType.DESKTOP, DeviceType.TABLET],
  },
  pos1Right: {
    name: '130868815/Desktop_Search/Pos1_Right',
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
    device: [DeviceType.DESKTOP, DeviceType.TABLET],
  },
  pos2Right: {
    name: '130868815/Desktop_Search/Pos2_Right',
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
    device: [DeviceType.DESKTOP, DeviceType.TABLET],
  },
  mobileTopBanner: {
    name: '130868815/Web_Mobile_Search/Topbanner',
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
    device: [DeviceType.MOBILE],
  },
  mobilePos1: {
    name: '130868815/Web_Mobile_Search/Pos1',
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
    device: [DeviceType.MOBILE],
  },
  mobilePos2: {
    name: '130868815/Web_Mobile_Search/Pos2',
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
    device: [DeviceType.MOBILE],
  },
};
