import { InjectionToken } from '@angular/core';

export const WINDOW_TOKEN: InjectionToken<Window> = new InjectionToken<Window>(
  'WINDOW_TOKEN',
  {
    providedIn: 'root',
    factory: () => window,
  }
);
