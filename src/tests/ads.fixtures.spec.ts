import { of } from 'rxjs';

import { AdSlot, AdSlotId } from '@core/ads/models';

export const MockAdsService = {
  init: () => {},
  refresh: () => {},
  displayAdBySlotId: (adSlotId) => {},
};

export const MockAmazonPublisherService = {
  isLibraryRefDefined: () => true,
  requestBid: () => of(null),
};

export const MockCriteoService = {
  isLibraryRefDefined: () => true,
  requestBid: () => of(null),
};

export const MockGooglePublisherTagService = {
  isLibraryRefDefined: () => true,
  init: () => {},
  setTargetingByAdsKeywords: () => {},
  setAdsSegmentation: () => {},
  displayAdBySlotId: (id: AdSlotId) => {},
};

export const MockLoadAdsService = {
  loadAds: () => of(true),
  setSlots(slots: AdSlot[]): void {},
};
