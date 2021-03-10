import { GoogleAdsSenseShoppingService } from './../../vendors/google/google-ads-sense-shopping.service';
import { Injectable } from '@angular/core';
import { AdsKeywordsService } from '../ads-keywords/ads-keywords.service';
const PubID = 'partner-vert-pla-wallapop-srp';

const ChannelIds = {
  itemDetailGoogle: 'itemdetailpage',
  searchPageGoogle: 'searchpage',
  searchListShopping: 'searchpgeintegWEB',
};

const shoppingStyles = {
  regular: {
    desktop: '3619815655',
    mobile: '9644454476',
  },
  wide: {
    desktop: '8537702058',
    mobile: '8537702058',
  },
};

const blockConfig = {
  kws: null,
  type: 'regular',
  isItemDetail: false,
  shoppingStyleId: shoppingStyles.regular.mobile,
  shoppingChannel: ChannelIds.searchListShopping,
  ABTest: false,
  maxTop: 1,
  width: window.screen.width,
};

const pageOptions = {
  pubId: PubID,
  query: blockConfig.kws,
  priceCurrency: 'EUR',
  adsafe: 'medium',
  adtest: 'off',
  channel: blockConfig.shoppingChannel
    ? blockConfig.shoppingChannel
    : blockConfig.isItemDetail
    ? ChannelIds.itemDetailGoogle
    : ChannelIds.searchPageGoogle,
  hl: 'es',
  adLoadedCallback: (containerName, adLoaded) => {
    /*
    if (!adLoaded && blockConfig.isItemDetail) {
      return this._hideItemDetailGoogleShoppingSection();
    } else if (!adLoaded) {
      return (document.getElementById(containerName).parentElement.style.display = 'none');
    }
    */
    console.log('adLoadedCallback', { containerName, adLoaded });
  },
};

@Injectable({
  providedIn: 'root',
})
export class AdsShoppingService {
  constructor(private googleAdsSenseShoppingService: GoogleAdsSenseShoppingService, private adsKeywordsService: AdsKeywordsService) {}

  displaySlot(): void {
    this.adsKeywordsService.saveCustomKeywords({ content: 'patinete' });
    this.adsKeywordsService.loadAdKeywords();
    const adsKeywords = this.adsKeywordsService.adKeywords;

    this.googleAdsSenseShoppingService.displayShopping({ ...pageOptions, query: adsKeywords });
  }
}
