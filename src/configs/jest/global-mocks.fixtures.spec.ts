import { DidomiLibrary } from '../../app/core/didomi/didomi.interface';
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

export const MOCK_GOOGLE_TAG = {
  cmd: {
    push(callback) {
      callback();
    },
  },
  enableServices() {},
  defineSlot() {
    return {
      addService() {},
    };
  },
  pubads() {
    return {
      defineSlot() {},
      enableSingleRequest() {},
      enableServices() {},
      disableInitialLoad() {},
      collapseEmptyDivs() {},
      setPublisherProvidedId() {},
      setTargeting() {},
      refresh() {},
    };
  },
  display: (_slotid: string) => {},
};

export const MOCK_VISIBILITY = {
  change: () => {},
  hidden: () => {},
  onVisible: () => {},
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
