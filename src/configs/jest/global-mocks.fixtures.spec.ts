// Definitions of libraries mocks
export const MOCK_APPBOY = {
  initialize: () => {}
};

export const MOCK_GA = () => {};
export const MOCK_GTAG = () => {};
export const MOCK_FBQ = () => {};
export const MOCK_PINTRK = () => {};
export const MOCK_TWQ = () => {};

export const MOCK_GOOGLE_TAG = {
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
  display: (_slotid: string) => {}
};

export const MOCK_VISIBILITY = {
  change: () => {},
  hidden: () => {}
};

export const MOCK_APSTAG = {
  fetchBids ({slots, timeout}, callback) { callback(); },
  setDisplayBids() {},
  init() {}
};

export const MOCK_CRITEO = {
  events: {
    push (callback) { callback(); }
  },
  SetLineItemRanges() {},
  RequestBids(adunit, callback, timeout) { callback(); },
  SetDFPKeyValueTargeting() {},
};

export const MOCK___CMP = (arg1, arg2, callback) => {};

export const MOCK_QUANCASTOPTIONS = {
  es: {},
  en: {}
};

export const MOCK_XMPP = {
  JID: class {
    constructor(_other_user_id, _domain) {
      return _other_user_id;
    }
  },
  createClient: () => {}
};

export const MOCK_LOCALSTORAGE = (function() {
  let store = {};
  return {
    getItem: key => store[key],
    setItem: (key, value) => store[key] = value.toString(),
    clear: () => store = {},
    removeItem: key => delete store[key]
  };
})();

// Assignments
Object.defineProperty(window, '__cmp', { value: MOCK___CMP });
Object.defineProperty(window, 'appboy', { value: MOCK_APPBOY });
Object.defineProperty(window, 'apstag', { value: MOCK_APSTAG });
Object.defineProperty(window, 'Criteo', { value: MOCK_CRITEO });
Object.defineProperty(window, 'fbq', { value: MOCK_FBQ });
Object.defineProperty(window, 'ga', { value: MOCK_GA });
Object.defineProperty(window, 'gtag', { value: MOCK_GTAG });
Object.defineProperty(window, 'googletag', { value: MOCK_GOOGLE_TAG });
Object.defineProperty(window, 'localStorage', { value: MOCK_LOCALSTORAGE });
Object.defineProperty(window, 'pintrk', { value: MOCK_PINTRK });
Object.defineProperty(window, 'quancastOptions', { value: MOCK_QUANCASTOPTIONS });
Object.defineProperty(window, 'twq', { value: MOCK_TWQ });
Object.defineProperty(window, 'Visibility', { value: MOCK_VISIBILITY });
Object.defineProperty(window, 'XMPP', { value: MOCK_XMPP });
