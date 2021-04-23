import { AdSlotConfiguration } from '../../models/ad-slot-configuration';
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
  sizes: googletag.GeneralSize;
  slotName: string;
}

export function AmazonPublisherServiceMapper(adSlots: AdSlotConfiguration[]): AmazonPublisherServiceAdSlot[] {
  return adSlots.map((slot) => ({
    slotID: slot.id,
    sizes: slot.sizes,
    slotName: slot.name,
  }));
}
