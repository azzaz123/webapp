import { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { NON_PARITY_URLS } from '@configs/non-parity-urls.config';

export const urlMatcher: UrlMatcher = (url: UrlSegment[]): UrlMatchResult => {
  if (url.length === 1) {
    const path = `/${url[0].path}`;
    if (NON_PARITY_URLS.includes(path)) {
      return { consumed: url };
    }
  }
  return null;
};
