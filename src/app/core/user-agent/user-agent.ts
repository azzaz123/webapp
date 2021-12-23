import { InjectionToken } from '@angular/core';

export const USER_AGENT: InjectionToken<string> = new InjectionToken<string>('USER_AGENT', {
  providedIn: 'root',
  factory: () => window.navigator.userAgent,
});
