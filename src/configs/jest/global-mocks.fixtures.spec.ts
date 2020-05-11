export const MOCK_APPBOY = {
  initialize: () => {},
  logCustomEvent: () => {},
  display: {
    automaticallyShowNewInAppMessages: () => {}
  },
  registerAppboyPushMessages: () => {},
  changeUser: _userId => {},
  openSession: () => {}
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
  hidden: () => {},
  onVisible: () => {}
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

export const MOCK_XMPP = {
  JID: class {
    private _userId: string;
    private _domain: string;

    constructor(userId, domain) {
      this._userId = userId;
      this._domain = domain;
    }

    get bare(): string {
      return `${this._userId}@${this._domain}`;
    }

    get local(): string {
      return this._userId;
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

export const MOCK_NAVIGATOR_CONNECTION = {
  rtt: 50,
  type: ''
};

export const MOCK_NAVIGATOR_GEOLOCATION = {
  getCurrentPosition: () => ''
};
