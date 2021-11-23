import { DeviceType } from '@core/device/deviceType.enum';
import { AdSlotId } from './ad-slot-id';

type AdSizeMapping = {
  [key in DeviceType]: { screenSize: number[]; mapping: (number[] | string)[] };
};

export interface AdSlotConfiguration {
  id: AdSlotId;
  name: string;
  sizes: googletag.GeneralSize;
  networkId: number;
  sizeMapping?: AdSizeMapping;
  device: DeviceType[];
  type: string;
}
