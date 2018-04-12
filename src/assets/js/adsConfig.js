
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
!function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");

apstag.init({
  pubID: '3703',
  adServer: 'googletag'
});
