import { DidomiLibrary } from '../../app/core/ads/vendors/didomi/didomi.interface';
import { ThreatMetrixLibrary } from 'app/core/trust-and-safety/threat-metrix.interface';

export const MOCK_APPBOY = {
  initialize: () => {},
  logCustomEvent: () => {},
  display: {
    automaticallyShowNewInAppMessages: () => {},
  },
  registerAppboyPushMessages: () => {},
  changeUser: (_userId) => {},
  openSession: () => {},
};

export const MOCK_GA = () => {};
export const MOCK_FBQ = () => {};
export const MOCK_PINTRK = () => {};

export const MOCK_GOOGLE_DEFINE_SLOT = {
  setTargeting(arg1, arg2) {
    return this;
  },
  addService(fn) {},
  defineSizeMapping() {
    return this;
  },
};

export const MOCK_GOOGLE_PUBABDS = {
  defineSlot() {},
  enableSingleRequest() {},
  enableServices() {},
  disableInitialLoad() {},
  collapseEmptyDivs() {},
  setPublisherProvidedId() {},
  setTargeting() {},
  refresh(adSlot?: googletag.Slot[]) {},
  clear(adSlot: googletag.Slot[]) {},
  clearTargeting() {},
  setRequestNonPersonalizedAds(num: number) {},
  addEventListener: (nameEvent: string, fn: (event) => void) => {},
};

export const MOCK_GOOGLE_SIZE_MAPPING = {
  addSize(screenSize: number[], mapping: number[][]) {
    return this;
  },
  build() {},
};

export const MOCK_GOOGLE_TAG = {
  cmd: {
    push(callback) {
      callback();
    },
  },
  enableServices() {},
  defineSlot() {
    return MOCK_GOOGLE_DEFINE_SLOT;
  },
  destroySlots(adSlots: googletag.Slot[]) {},
  pubads() {
    return MOCK_GOOGLE_PUBABDS;
  },
  display: (_slotid: string) => {},
  apiReady: true,
  sizeMapping() {
    return MOCK_GOOGLE_SIZE_MAPPING;
  },
};

export const MOCK_APSTAG = {
  fetchBids({ slots, timeout }, callback) {
    callback();
  },
  setDisplayBids() {},
  init() {},
};

export const MOCK_CRITEO = {
  events: {
    push(callback) {
      callback();
    },
  },
  RequestBidsOnGoogleTagSlots(slotId, fn, time) {
    fn();
  },
  SetLineItemRanges() {},
  RequestBids(adunit, callback, timeout) {
    callback();
  },
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
  createClient: () => {},
};

class MockStorage {
  private store = {};
  public getItem = (key) => this.store[key];
  public setItem = (key, value) => (this.store[key] = value.toString());
  public clear = () => (this.store = {});
  public removeItem = (key) => delete this.store[key];
}

export const MOCK_LOCALSTORAGE = new MockStorage();
export const MOCK_SESSIONSTORAGE = new MockStorage();

export const MOCK_NAVIGATOR_CONNECTION = {
  rtt: 50,
  type: '',
};

export const MOCK_NAVIGATOR_GEOLOCATION = {
  getCurrentPosition: () => '',
};

export const MOCK_NAVIGATOR_LANGUAGES = ['es'];

export const MOCK_DIDOMI: DidomiLibrary = {
  getUserConsentStatusForPurpose: (key) => true,
  getUserConsentStatusForVendor: (key) => true,
  getUserConsentStatusForAll: () => {
    return {
      purposes: {
        enabled: ['cookies'],
        disabled: ['analytics'],
      },
      vendors: {
        enabled: [1, 2, 3],
        disabled: [4, 5],
      },
    };
  },
  on: (event: string, callback: (event: any) => void) => {
    callback({});
  },
};

export const MOCK_THREAT_METRIX: ThreatMetrixLibrary = {
  nfl: (_domain: string, _orgId: string, _sessionId: string) => {},
};

export const MOCK_LOCATION: Location = {
  ...window.location,
};

export class MockNotificationClass {
  public static requestPermission() {
    return Promise.resolve('granted');
  }

  public addEventListener(_eventName) {}
}

export const MOCK_SCREEN: { width: number; height: number } = {
  width: 1366,
  height: 768,
};

export const MOCK_HERE_MAPS: any = {
  Map: null,
  clustering: null,
  data: null,
  geo: null,
  map: null,
  mapevents: null,
  util: null,
  math: null,
  net: null,
  service: { Platform: (e) => e },
  ui: null,
};

export class MockIntersectionObserver implements Partial<IntersectionObserver> {
  public static callback;

  constructor(_callback: Function) {
    MockIntersectionObserver.callback = _callback;
  }

  observe(_target: Element): void {
    MockIntersectionObserver.callback([_target]);
  }

  unobserve(_target: Element): void {}
}
