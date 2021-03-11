import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';

interface AdShoppingLibPageOptions extends AdShoppingPageOptions {
  query: string;
}

export type GoogCsa = (
  name: string,
  adShoppingLibPageOptions: AdShoppingLibPageOptions,
  adSlotShoppingConfiguration: AdSlotShoppingConfiguration
) => void;
