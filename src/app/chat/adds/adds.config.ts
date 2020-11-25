export const ADD_SOURCES: string[] = [
  'https://static.criteo.net/js/ld/publishertag.js',
  'https://www.googletagservices.com/tag/js/gpt.js',
  '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
];

export const initAdsConfig = () => {
  /* DFP */
  if (!googletag) {
    googletag = {};
  } // TODO: Check if can be removed

  /* Adomik */ if (!window['Adomik']) {
    window['Adomik'] = {};
  }
  Adomik.randomAdGroup = function () {
    const rand = Math.random();
    switch (false) {
      case !(rand < 0.09):
        return 'ad_ex' + Math.floor(100 * rand);
      case !(rand < 0.1):
        return 'ad_bc';
      default:
        return 'ad_opt';
    }
  };

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
