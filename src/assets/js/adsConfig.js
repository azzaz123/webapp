
/* DFP */
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

/* Adomik */
window.Adomik = window.Adomik || {};

Adomik.randomAdGroup = function () {
  var rand = Math.random();
  switch (false) {
    case !(rand < 0.09):
      return "ad_ex" + (Math.floor(100 * rand));
    case !(rand < 0.10):
      return "ad_bc";
    default:
      return "ad_opt";
  }
};

/* Criteo */
window.Criteo = window.Criteo || {};
window.Criteo.events = window.Criteo.events || [];

var w = window;
var doc = window.document;
for (i = 0; i < 10; i++) {
  w = w.parent;
  if (w.Criteo) {
    try {
      w.Criteo.RenderAd("%%PATTERN:crt_bidid%%", doc);
      break;
    } catch (e) {
      continue;
    }
  }
}

/* Amazon Publisher Service */
var apstag = window['apstag'] || {
  init() {},
  fetchBids() {},
  setDisplayBids() {},
  targetingKeys() {return []}
};

apstag.init({
  pubID: '3703',
  adServer: 'googletag',
  gdpr: {
    cmpTimeout: 1000
  }
});
