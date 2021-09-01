import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import { APP_LOCALE, SUBDOMAINS } from './subdomains.config';

export const SITE_URL: InjectionToken<string> = new InjectionToken<string>('SITE_URL');

export function siteUrlFactory(locale: APP_LOCALE): string {
  return `${environment.protocol}${SUBDOMAINS[locale]}${environment.appDomain}`;
}
