
/* DFP */
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

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
  adServer: 'googletag'
});
