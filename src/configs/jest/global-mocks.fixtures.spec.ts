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

export const MOCK_LOCAlSTORAGE = {};

// Assignments
window['appboy'] = MOCK_APPBOY;
window['googletag'] = MOCK_GOOGLE_TAG;
window['Visibility'] = MOCK_VISIBILITY;
window['ga'] = MOCK_GA;
window['gtag'] = MOCK_GTAG;
window['fbq'] = MOCK_FBQ;
window['pintrk'] = MOCK_PINTRK;
window['twq'] = MOCK_TWQ;
window['apstag'] = MOCK_APSTAG;
window['Criteo'] = MOCK_CRITEO;
window['__cmp'] = MOCK___CMP;
window['quantcastOptions'] = MOCK_QUANCASTOPTIONS;
window['XMPP'] = MOCK_XMPP;

document.head.appendChild(document.createElement('script'));
