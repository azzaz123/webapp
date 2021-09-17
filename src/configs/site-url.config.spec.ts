import { environment } from '@environments/environment';
import { siteUrlFactory } from './site-url.config';
import { FUNCTIONAL_WEBAPP_SUBDOMAIN, SITE_URL_SUBDOMAINS } from './subdomains.config';

const MOCK_WINDOW_LOCATION = (hostname: string) =>
  ({
    location: { hostname },
  } as Window);

const MOCK_SITE_URL = (subdomain: FUNCTIONAL_WEBAPP_SUBDOMAIN | string) =>
  `${environment.protocol}${SITE_URL_SUBDOMAINS[subdomain]}${environment.appDomain}`;

describe('Site URL configuration based on browser hostname', () => {
  describe('when the hostname is from the Spanish domain', () => {
    it('should return the site URL for the Spanish site', () => {
      const subdomain: FUNCTIONAL_WEBAPP_SUBDOMAIN = 'es';
      const expectedSiteUrl = MOCK_SITE_URL(subdomain);
      const location = MOCK_WINDOW_LOCATION(expectedSiteUrl);

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });

  describe('when the hostname is from the Italian domain', () => {
    it('should return the site URL for the Italian site', () => {
      const subdomain: FUNCTIONAL_WEBAPP_SUBDOMAIN = 'it';
      const expectedSiteUrl = MOCK_SITE_URL(subdomain);
      const location = MOCK_WINDOW_LOCATION(expectedSiteUrl);

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });

  describe('when the hostname is from the French domain', () => {
    it('should return the site URL for the French site', () => {
      const subdomain: FUNCTIONAL_WEBAPP_SUBDOMAIN = 'fr';
      const expectedSiteUrl = MOCK_SITE_URL(subdomain);
      const location = MOCK_WINDOW_LOCATION(expectedSiteUrl);

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });

  describe('when the hostname is from the French domain', () => {
    it('should set the site URL as spain', () => {
      const subdomain: FUNCTIONAL_WEBAPP_SUBDOMAIN = 'web-en';
      const expectedSiteUrl = MOCK_SITE_URL(subdomain);
      const location = MOCK_WINDOW_LOCATION(expectedSiteUrl);

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });

  describe('when the hostname does not contain a subdomain', () => {
    it('should return the site URL for the global site (www)', () => {
      const location = MOCK_WINDOW_LOCATION('localhost');
      const expectedSiteUrl = MOCK_SITE_URL('www');

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });

  describe('when the hostname subdomain is not valid', () => {
    it('should return the site URL for the global site (www)', () => {
      const location = MOCK_WINDOW_LOCATION('pt.wallapop.com');
      const expectedSiteUrl = MOCK_SITE_URL('www');

      const siteUrl = siteUrlFactory(location);

      expect(siteUrl).toEqual(expectedSiteUrl);
    });
  });
});
