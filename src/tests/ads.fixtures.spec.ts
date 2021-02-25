import {
  AD_DESKTOP_MAPPING,
  AD_DESKTOP_SCREEN_SIZE,
  AD_MOBILE_MAPPING,
  AD_MOBILE_SCREEN_SIZE,
  AD_TABLET_SCREEN_SIZE,
  AD_TABLET_MAPPING,
} from '@core/ads/constants';
import { AdKeyWords, AdSlot, AdSlotId } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';
import { of } from 'rxjs';

export const MockAdsService = {
  adsReady$: of(true),
  init: () => {},
  refresh: () => {},
  displayAdBySlotId: (adSlotId) => {},
  setSlots: (adSlots) => {},
  setAdKeywords: (adKeywords: AdKeyWords) => {},
};

export const MockAmazonPublisherService = {
  isLibraryRefDefined: () => true,
  requestBid: () => of(null),
  init: () => {},
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
  setSlots: (slots: AdSlot) => {},
  refreshAds: () => {},
  setAdKeywords: (adKeywords: AdKeyWords) => {},
};

export const MockLoadAdsService = {
  loadAds: () => of(true),
};

export const MockDidomiService = {
  allowSegmentation$: of(true),
  loadDidomiLib: () => of(null),
  isLibraryRefDefined: () => true,
};

export const MockAdsKeywords: AdKeyWords = {
  userId: '124214',
  brand: 'vinted',
  content: 'contenido',
};

export const MockAdsKeywordsService = {
  adKeywords: MockAdsKeywords,
  loadAdKeywords: () => {},
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
        mapping: AD_MOBILE_MAPPING.big,
      },
    },
    device: [DeviceType.DESKTOP],
  },
];
