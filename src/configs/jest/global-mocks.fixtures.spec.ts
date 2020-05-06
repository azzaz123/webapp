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
  setDisplayBids() {},
  init() {}
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


 document.head.appendChild(document.createElement('script'));

// Below you will find definitions given by `jest-preset-angular` to mock DOM interactions
Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
