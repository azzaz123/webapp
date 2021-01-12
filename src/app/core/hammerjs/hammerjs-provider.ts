import { Provider } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';

export const HAMMER_PROVIDER: Provider = {
  provide: HAMMER_LOADER,
  useValue: async () => {
    return import('hammerjs/hammer');
  },
};
