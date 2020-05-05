googletag = {
  cmd: {
    push (callback) { callback(); }
  },
  enableServices() {},
  defineSlot () {
    return {
      addService () {}
    };
  },
  pubads () {
    return {
      defineSlot() {},
      enableSingleRequest() {},
      enableServices() {},
      disableInitialLoad() {},
      collapseEmptyDivs() {},
      setPublisherProvidedId() {},
      setTargeting () {},
      refresh () {}
    };
  },
  display: (slotid: string) => {}
};

 ga = function() {};
 gtag = function() {};
 fbq = function() {};
 pintrk = function() {};
 twq = function() {};

 apstag = {
  fetchBids ({slots, timeout}, callback) { callback(); },
  setDisplayBids() {}
};

 Criteo = {
  events: {
    push (callback) { callback(); }
  },
  SetLineItemRanges() {},
  RequestBids(adunit, callback, timeout) { callback(); },
  SetDFPKeyValueTargeting() {},
};

 __cmp = function(arg1, arg2, callback) {};
 quancastOptions =  {es: {}, en: {}};

 appboy = function() {}