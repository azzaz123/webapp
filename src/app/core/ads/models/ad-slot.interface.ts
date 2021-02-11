export type AdSlotId = string;

export interface AdSlot {
  id: AdSlotId;
  name: string;
  sizes: [number, number][];
  networkId: number;
}
