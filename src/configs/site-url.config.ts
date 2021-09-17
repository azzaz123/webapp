import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import { SEO_WEB_SUBDOMAIN, SITE_URL_SUBDOMAINS } from './subdomains.config';

export const SITE_URL: InjectionToken<string> = new InjectionToken<string>('SITE_URL');
const SUBDOMAIN_REGEX = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i;

export function siteUrlFactory(window: Window): string {
  const hostname = window.location.hostname;
  const hasSubdomain = SUBDOMAIN_REGEX.test(hostname);

  if (hasSubdomain) {
    const subdomain = hostname.match(SUBDOMAIN_REGEX)[1];
    const siteUrlSubdomain: SEO_WEB_SUBDOMAIN = SITE_URL_SUBDOMAINS[subdomain] || 'www';

    return getSiteUrl(siteUrlSubdomain);
  }
  return getSiteUrl(SITE_URL_SUBDOMAINS['www']);
}

function getSiteUrl(subdomain: SEO_WEB_SUBDOMAIN) {
  return `${environment.protocol}${SITE_URL_SUBDOMAINS[subdomain]}${environment.appDomain}`;
}
