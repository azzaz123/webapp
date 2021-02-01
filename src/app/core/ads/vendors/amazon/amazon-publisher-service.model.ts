import { AdSlot } from './../../models/ad-slot.interface';
export interface AmazonPublisherServiceLibrary {
  bids: Function;
  debug: Function;
  fetchBids: Function;
  init: Function;
  punt: Function;
  renderImp: Function;
  setDisplayBids: Function;
  targetingKeys: Function;
  _getSlotIdToNameMapping: Function;
}

export interface AmazonPublisherServiceAdSlot {
  slotID: string;
  sizes: [number, number][];
  slotName: string;
}

export function AmazonPublisherServiceMapper(
  adSlots: AdSlot[]
): AmazonPublisherServiceAdSlot[] {
  return adSlots.map((slot) => ({
    slotID: slot.id,
    sizes: slot.sizes,
    slotName: slot.name,
  }));
}
