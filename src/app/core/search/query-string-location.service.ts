import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { CookieService } from 'ngx-cookie';
import { SEO_COOKIE_LOCATION_KEY } from '@public/features/search/core/services/enums/seo-cookie-location-key.enum';
import { SEARCH_LOCATION_KEY } from '@public/features/search/core/services/enums/local-storage-location-key.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { APP_LOCALE } from 'configs/subdomains.config';

@Injectable()
export class QueryStringLocationService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private cookieService: CookieService) {}

  public getLocationParameters(): SearchLocation {
    const seoLocation = this.getSeoCookieLocation();

    if (seoLocation) {
      return seoLocation;
    }

    const localStorageLocation = this.getLocalStorageLocation();

    if (localStorageLocation) {
      return localStorageLocation;
    }

    return this.getDefaultLocation();
  }

  private getSeoCookieLocation(): SearchLocation {
    const latitude = this.cookieService.get(SEO_COOKIE_LOCATION_KEY.LATITUDE);
    const longitude = this.cookieService.get(SEO_COOKIE_LOCATION_KEY.LONGITUDE);

    if (latitude && longitude) {
      return {
        latitude,
        longitude,
      };
    }
  }

  private getLocalStorageLocation(): SearchLocation {
    const latitude = localStorage.getItem(SEARCH_LOCATION_KEY.LATITUDE);
    const longitude = localStorage.getItem(SEARCH_LOCATION_KEY.LONGITUDE);

    if (latitude && longitude) {
      return {
        latitude,
        longitude,
      };
    }
  }

  private getDefaultLocation(): SearchLocation {
    const defaultLocation = DEFAULT_LOCATIONS[this.locale] || DEFAULT_LOCATIONS.en;

    return {
      [FILTER_QUERY_PARAM_KEY.longitude]: defaultLocation[FILTER_QUERY_PARAM_KEY.longitude],
      [FILTER_QUERY_PARAM_KEY.latitude]: defaultLocation[FILTER_QUERY_PARAM_KEY.latitude],
    };
  }

  private hasLocationParameters(location: SearchLocation): boolean {
    return !!(location && location[FILTER_QUERY_PARAM_KEY.longitude] && location[FILTER_QUERY_PARAM_KEY.latitude]);
  }
}
