import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_DESKTOP_VERTICAL_MAPPING,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_MAPPING,
  AD_TABLET_SCREEN_SIZE,
} from '@core/ads/constants/ad-slots';
import { AdSlotConfiguration } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export interface ItemDetailAdSlotsConfiguration {
  item1: AdSlotConfiguration;
  item2l: AdSlotConfiguration;
  item3r: AdSlotConfiguration;
}

export const ADS_ITEM_DETAIL: ItemDetailAdSlotsConfiguration = {
  item1: {
    name: '130868815/web/item1',
    id: 'sky-unit-item-top-1',
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
  },
  item2l: {
    name: '130868815/web/item2l',
    id: 'sky-unit-item-left-2',
    sizes: AD_DESKTOP_VERTICAL_MAPPING,
    sizeMapping: {
      desktop: {
        screenSize: AD_DESKTOP_SCREEN_SIZE,
        mapping: AD_DESKTOP_VERTICAL_MAPPING,
      },
      tablet: {
        screenSize: AD_TABLET_SCREEN_SIZE,
        mapping: AD_MOBILE_MAPPING.medium,
      },
      mobile: {
        screenSize: AD_MOBILE_SCREEN_SIZE,
        mapping: AD_MOBILE_MAPPING.big,
      },
    },
    networkId: 6866,
    type: 'item',
    device: [DeviceType.DESKTOP, DeviceType.TABLET, DeviceType.MOBILE],
  },
  item3r: {
    name: '130868815/web/item3r',
    id: 'sky-unit-item-right-3',
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
    type: 'item',
    device: [DeviceType.DESKTOP],
  },
};

const AD_AFFILIATION_SLOT_MOBILE = (index: number) => '130868815/App_Affiliation/Mobile_' + index;
const AD_AFFILIATION_SLOT_DESKTOP = (index: number) => '130868815/Desktop_Affiliation/Web_' + index;

export function FactoryAdAffiliationSlotConfiguration(deviceType: DeviceType): AdSlotConfiguration[] {
  return new Array(3)
    .fill('')
    .map((_, index: number) => index + 1)
    .map((index: number) => ({
      id: 'item-affiliation-' + index,
      name: deviceType === DeviceType.MOBILE ? AD_AFFILIATION_SLOT_MOBILE(index) : AD_AFFILIATION_SLOT_DESKTOP(index),
      sizes: [['fluid']],
      networkId: 6866,
      type: 'item',
      device: deviceType === DeviceType.MOBILE ? [DeviceType.MOBILE] : [DeviceType.DESKTOP, DeviceType.TABLET],
    }));
}
