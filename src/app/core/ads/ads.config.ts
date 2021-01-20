export const GOOGLE_PUBLISHER_TAG_URL =
  'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

export const RICH_AUDIENCE_URL =
  'https://bridge.richmediastudio.com/ab083674fb8200b877a6983126e4477d/wallapop/pb_wrapper/dev/lib.js';

export const CRITEO_URL = 'https://static.criteo.net/js/ld/publishertag.js';

export const GOOGLE_AD_SENSE_URL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export const ADS_SOURCES: string[] = [
  GOOGLE_PUBLISHER_TAG_URL,
  RICH_AUDIENCE_URL,
  CRITEO_URL,
  GOOGLE_AD_SENSE_URL,
];

export const AD_GROUP = 'ad_opt';

export const initAdsConfig = () => {
  if (!googletag) {
    throw new Error('Google Publisher Tag is not defined');
  }

  /* Criteo */
  if (!window['Criteo']) {
    window['Criteo'] = {};
  }
  Criteo.events = Criteo.events || [];
  for (let i = 0; i < 10; i++) {
    if (Criteo) {
      try {
        Criteo.RenderAd('%%PATTERN:crt_bidid%%', window.document);
        break;
      } catch (e) {
        continue;
      }
    }
  }

  /* Amazon Publisher Service */
  if (!window['apstag']) {
    window['apstag'] = {
      init() {},
      fetchBids() {},
      setDisplayBids() {},
      targetingKeys() {
        return [];
      },
    };
  }
  apstag.init({
    pubID: '3703',
    adServer: 'googletag',
    gdpr: {
      cmpTimeout: 1000,
    },
  });
};
