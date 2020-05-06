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

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

/**
 * Below you will find all definitions made by us to make our tests run properly
 */

// TODO: An issue with `jest-preset-angular` is using only "compilerOptions" in tsconfig, file imports are done here (e.g.:polyfills)
// More info about the issue: https://github.com/thymikee/jest-preset-angular/issues/347
import '@angular/localize/init';

// Mock global variables in window manually
import './global-mocks.fixtures.spec';
