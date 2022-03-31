import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { NON_PARITY_URLS } from './public-routing-constants';

export const nonParityUrlMatcher: UrlMatcher = (url: UrlSegment[]): UrlMatchResult => {
  if (url.length === 1) {
    const path = `/${url[0].path}`;
    if (NON_PARITY_URLS.includes(path)) {
      return { consumed: url };
    }
  }
  return null;
};
