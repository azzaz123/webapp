import 'jest-preset-angular';

// Mock DOM interactions
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

/**
 * Below you will find all definitions made by us to make our tests run properly
 */

// TODO: An issue with `jest-preset-angular` is using only "compilerOptions" in tsconfig, file imports are done here (e.g.:polyfills)
// More info about the issue: https://github.com/thymikee/jest-preset-angular/issues/347
import '@angular/localize/init';

// Ads "polyfills"
import '../../assets/js/adsConfig.js';

// Prototype overrides
Element.prototype.scrollIntoView = () => {};

// Mock global variables in window manually
import * as GLOBAL_MOCKS from './global-mocks.fixtures.spec';

Object.defineProperty(window, 'appboy', { value: GLOBAL_MOCKS.MOCK_APPBOY });
Object.defineProperty(window, 'apstag', { value: GLOBAL_MOCKS.MOCK_APSTAG });
Object.defineProperty(window, 'Criteo', { value: GLOBAL_MOCKS.MOCK_CRITEO });
Object.defineProperty(window, 'Didomi', { value: GLOBAL_MOCKS.MOCK_DIDOMI });
Object.defineProperty(window, 'fbq', { value: GLOBAL_MOCKS.MOCK_FBQ, writable: true });
Object.defineProperty(window, 'ga', { value: GLOBAL_MOCKS.MOCK_GA });
Object.defineProperty(window, 'gtag', { value: GLOBAL_MOCKS.MOCK_GTAG });
Object.defineProperty(window, 'googletag', { value: GLOBAL_MOCKS.MOCK_GOOGLE_TAG });
Object.defineProperty(window, 'localStorage', { value: GLOBAL_MOCKS.MOCK_LOCALSTORAGE });
Object.defineProperty(window, 'location', { value: GLOBAL_MOCKS.MOCK_LOCATION });
Object.defineProperty(window, 'Notification', { value: GLOBAL_MOCKS.MockNotificationClass, writable: true });
Object.defineProperty(window, 'sessionStorage', { value: GLOBAL_MOCKS.MOCK_SESSIONSTORAGE });
Object.defineProperty(window, 'pintrk', { value: GLOBAL_MOCKS.MOCK_PINTRK, writable: true });
Object.defineProperty(window, 'twq', { value: GLOBAL_MOCKS.MOCK_TWQ });
Object.defineProperty(window, 'Visibility', { value: GLOBAL_MOCKS.MOCK_VISIBILITY });
Object.defineProperty(window, 'XMPP', { value: GLOBAL_MOCKS.MOCK_XMPP });
Object.defineProperty(window, 'wadgtlft', { value: GLOBAL_MOCKS.MOCK_THREAT_METRIX, writable: true });
Object.defineProperty(navigator, 'connection', { value: GLOBAL_MOCKS.MOCK_NAVIGATOR_CONNECTION });
Object.defineProperty(navigator, 'geolocation', { value: GLOBAL_MOCKS.MOCK_NAVIGATOR_GEOLOCATION, writable: true });
