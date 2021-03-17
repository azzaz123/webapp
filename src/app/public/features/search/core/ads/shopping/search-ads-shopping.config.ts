import { AD_SHOPPING_PUB_ID_WALLAPOP } from '@core/ads/constants';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration, PageOptionLoadedCallback } from '@core/ads/models';
import { AdShoppingChannel } from './ad-shopping-channel';

export const AD_SHOPPING_PUBLIC_SEARCH: AdSlotShoppingConfiguration = {
  slotId: 'afshcontainer',
  container: 'afshcontainer',
  width: 500,
  height: 400,
};

export const AD_SHOPPING_NATIVE_CONTAINER_PUBLIC_SEARCH = 'div-gpt-ad-1536058445169';

export function AdShoppingPageOptionPublicSearchFactory(
  channel: AdShoppingChannel,
  callback: PageOptionLoadedCallback = null
): AdShoppingPageOptions {
  return {
    pubId: AD_SHOPPING_PUB_ID_WALLAPOP,
    priceCurrency: 'EUR',
    adsafe: 'medium',
    adtest: 'off',
    channel,
    hl: 'es',
    adLoadedCallback: callback,
  };
}
