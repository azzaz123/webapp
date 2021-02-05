import { of } from 'rxjs';

import { AdKeyWords, AdSlot, AdSlotId } from '@core/ads/models';

export const MockAdsService = {
  adsReady$: of(true),
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

export const MockAdsKeywords: AdKeyWords = {
  userId: '124214',
  brand: 'vinted',
  content: 'contenido',
};

export const MockAdsKeywordsService = {
  adKeywords: MockAdsKeywords,
  updateAdKeywords: () => {},
};

export const MockAdSlots: AdSlot[] = [
  {
    id: 'div-gpt-ad-1508490196308-0',
    name: '/130868815/chat_right',
    sizes: [
      [120, 600],
      [160, 600],
      [300, 250],
      [300, 600],
      [336, 280],
    ],
    networkId: 235235,
  },
];