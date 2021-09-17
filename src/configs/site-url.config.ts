import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import { SITE_URL_SUBDOMAINS } from './subdomains.config';

export const SITE_URL: InjectionToken<string> = new InjectionToken<string>('SITE_URL');
const SUBDOMAIN_REGEX = new RegExp('/(?:http[s]*://)*(.*?).(?=[^/]*..{2,5})/i');

export function siteUrlFactory(window: Window): string {
  const hostname = window.location.hostname;
  const hasSubdomain = SUBDOMAIN_REGEX.test(hostname);
  const subdomain = hasSubdomain ? hostname.match(SUBDOMAIN_REGEX)[1] : 'www';
  const siteUrlSubdomain = SITE_URL_SUBDOMAINS[subdomain];

  return `${environment.protocol}${siteUrlSubdomain}${environment.appDomain}`;
}
