export type PageOptionLoadedCallback = (containerName: string, adLoaded: boolean) => void;

export interface AdShoppingPageOptions {
  pubId: string;
  priceCurrency: string;
  adsafe: string;
  adtest: string;
  channel: string;
  hl: string;
  adLoadedCallback: PageOptionLoadedCallback;
}
