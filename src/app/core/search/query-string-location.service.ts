import { Inject, Injectable } from '@angular/core';
import { SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { CookieService } from 'ngx-cookie';
import { SEO_COOKIE_LOCATION_KEY } from '@public/features/search/core/services/enums/seo-cookie-location-key.enum';
import { SEARCH_LOCATION_KEY } from '@public/features/search/core/services/enums/local-storage-location-key.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Injectable()
export class QueryStringLocationService {
  // FIXME: Subdomain is getting it's value from a cookie (subdomain) that seems to have the wrong value
  constructor(@Inject('SUBDOMAIN') private subdomain: string, private cookieService: CookieService) {}

  public getLocationParameters(locationFromParameters?: SearchLocation): SearchLocation {
    if (this.hasLocationParameters(locationFromParameters)) {
      return locationFromParameters;
    }

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
    const defaultLocation = DEFAULT_LOCATIONS[this.subdomain] || DEFAULT_LOCATIONS.en;

    return {
      [FILTER_QUERY_PARAM_KEY.longitude]: defaultLocation[FILTER_QUERY_PARAM_KEY.longitude],
      [FILTER_QUERY_PARAM_KEY.latitude]: defaultLocation[FILTER_QUERY_PARAM_KEY.latitude],
    };
  }

  private hasLocationParameters(location: SearchLocation): boolean {
    return !!(location && location[FILTER_QUERY_PARAM_KEY.longitude] && location[FILTER_QUERY_PARAM_KEY.latitude]);
  }
}
