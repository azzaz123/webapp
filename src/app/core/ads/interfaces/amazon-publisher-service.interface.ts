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
