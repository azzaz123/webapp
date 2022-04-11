import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { NON_PARITY_URLS, PUBLIC_PATHS } from './public-routing-constants';

export const nonParityUrlMatcher: UrlMatcher = (url: UrlSegment[]): UrlMatchResult => {
  if (url.length === 1) {
    const path = url[0].path as PUBLIC_PATHS;
    if (NON_PARITY_URLS.includes(path)) {
      return { consumed: url };
    }
  }
  return null;
};
