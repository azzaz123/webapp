// CRITEO
window.Criteo = window.Criteo || {};
window.Criteo.events = window.Criteo.events || [];

var adUnits = {
  "placements": [
    {"slotid": "div-gpt-ad-1508490196308-0", "zoneid": 978109}, /* Wallapop - SP - 240x400 - User detail  */
  ]
};

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

// GOOGLE DFP
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

googletag.cmd.push(function () {
  googletag.defineSlot('/130868815/chat_right', [[240, 400], [120,600], [160,600], [300,250]], 'div-gpt-ad-1508490196308-0').addService(googletag.pubads());
  var publisherId = getCookie('publisherId');
  publisherId = publisherId ? publisherId : '-1' + Array(31).join("0");
  googletag.pubads().enableSingleRequest();
  googletag.pubads().collapseEmptyDivs();
  googletag.pubads().disableInitialLoad();
  googletag.pubads().setPublisherProvidedId(publisherId);
  googletag.enableServices();
  var launchAdServer = function() {
    /* Perform key-value targeting for your ad server */
    Criteo.SetDFPKeyValueTargeting();
  };
  Criteo.events.push(function () {
    // Define the price band range
    Criteo.SetLineItemRanges("0..4.5:0.01;4.50..27:0.05;27..72:0.1");
    // Call Criteo and execute the callback function for a given timeout
    Criteo.RequestBids(adUnits, launchAdServer, 1500);
  });
});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
