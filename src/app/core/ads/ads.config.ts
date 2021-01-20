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
