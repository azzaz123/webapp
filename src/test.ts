// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

declare global {
  interface Window { fbq: any; }
  interface Window { pintrk: any; }
}

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

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
