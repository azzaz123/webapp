import { DeviceType } from '@core/device/deviceType.enum';

export type AdSlotId = string;

type AdSizeMapping = {
  [key in DeviceType]: { screenSize: number[]; mapping: number[][] };
};

export interface AdSlotConfiguration {
  id: AdSlotId;
  name: string;
  sizes: number[][];
  networkId: number;
  sizeMapping?: AdSizeMapping;
  device: DeviceType[];
  type?: string;
}
