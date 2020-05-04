// This line loads the necessary presets for jest to work with Angular
import 'jest-preset-angular';

// Import global mocks defined by us
import './global-mocks';

// TODO: Investigate why we can not load polyfill file passing the tsconfig.json to Jest
import '@angular/localize/init';

// Extra definitons for mocking DOM interactions
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
