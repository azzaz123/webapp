window['ga'] = function() {};
window['googletag'] = {
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
window['gtag'] = function() {};
window['fbq'] = function() {};
window['pintrk'] = function() {};
window['twq'] = function() {};

window['apstag'] = {
  fetchBids ({slots, timeout}, callback) { callback(); },
  setDisplayBids() {}
};

window['Criteo'] = {
  events: {
    push (callback) { callback(); }
  },
  SetLineItemRanges() {},
  RequestBids(adunit, callback, timeout) { callback(); },
  SetDFPKeyValueTargeting() {},
};

window['__cmp'] = function(arg1, arg2, callback) {};
window['quancastOptions'] =  {es: {}, en: {}};
