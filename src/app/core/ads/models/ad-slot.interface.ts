export type AdSlotId = string;

type AdSizes = 'desktop' | 'tablet' | 'mobile';

type AdSizeMapping = {
  [key in AdSizes]: { screenSize: number[]; mapping: number[][] };
};

export interface AdSlot {
  id: AdSlotId;
  name: string;
  sizes: number[][];
  networkId: number;
  sizeMapping?: AdSizeMapping;
  type?: string;
  device?: AdSizes;
}
