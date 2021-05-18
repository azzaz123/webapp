import { Injectable } from '@angular/core';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { SEARCH_LOCATION_KEY } from '@public/features/search/core/services/enums/local-storage-location-key.enum';
import { CookieService } from 'ngx-cookie';
import { SEO_COOKIE_LOCATION_KEY } from '@public/features/search/core/services/enums/seo-cookie-location-key.enum';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { Observable, of } from 'rxjs';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { map } from 'rxjs/operators';
import { GeolocationNotAvailableError } from '../errors/geolocation-not-available.error';

// TODO: This should be placed at the location filter level when implemented

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
};

@Injectable()
export class LocationFilterServiceService {
  constructor(private cookieService: CookieService, private geolocationService: GeolocationService) {}

  public setUserLocation(location: LabeledSearchLocation): void {
    const { latitude, longitude, label } = location;
    localStorage.setItem(SEARCH_LOCATION_KEY.LATITUDE, latitude);
    localStorage.setItem(SEARCH_LOCATION_KEY.LONGITUDE, longitude);
    localStorage.setItem(SEARCH_LOCATION_KEY.LABEL, label);
  }

  public getLocationLabel(location: SearchLocation): Observable<string> {
    const seoLocation = this.getSeoLocation();

    if (seoLocation && this.isSameLocation(location, seoLocation)) {
      return of(seoLocation.label);
    }

    const searchLocation = this.getSearchLocation();

    if (searchLocation && this.isSameLocation(location, searchLocation)) {
      return of(searchLocation.label);
    }

    const matchingDefaultLocation = this.getDefaultLocations().find((defaultLocation) => this.isSameLocation(location, defaultLocation));

    if (matchingDefaultLocation) {
      return of(matchingDefaultLocation.label);
    }

    const { latitude, longitude } = location;
    return this.geolocationService.reverseGeocode(latitude, longitude).pipe(
      map((label) => {
        return this.formatLabel(label);
      })
    );
  }

  public getLocationFromBrowserAPI(): Promise<SearchLocation> {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            const latitude = `${position.coords.latitude}`;
            const longitude = `${position.coords.longitude}`;
            const location: SearchLocation = { latitude, longitude };

            resolve(location);
          },
          (error: PositionError) => {
            reject(error);
          },
          GEOLOCATION_OPTIONS
        );
      });
    } else {
      return Promise.reject(new GeolocationNotAvailableError(`Your browser doesn't support geolocation`));
    }
  }

  private getDefaultLocations(): LabeledSearchLocation[] {
    return Object.values(DEFAULT_LOCATIONS);
  }

  private getSeoLocation(): LabeledSearchLocation {
    const latitude = this.cookieService.get(SEO_COOKIE_LOCATION_KEY.LATITUDE);
    const longitude = this.cookieService.get(SEO_COOKIE_LOCATION_KEY.LONGITUDE);
    const label = this.cookieService.get(SEO_COOKIE_LOCATION_KEY.LABEL);

    if (latitude && longitude && label) {
      return {
        latitude,
        longitude,
        label,
      };
    }
  }

  private getSearchLocation(): LabeledSearchLocation {
    const latitude = localStorage.getItem(SEARCH_LOCATION_KEY.LATITUDE);
    const longitude = localStorage.getItem(SEARCH_LOCATION_KEY.LONGITUDE);
    const label = localStorage.getItem(SEARCH_LOCATION_KEY.LABEL);

    if (latitude && longitude && label) {
      return {
        latitude,
        longitude,
        label,
      };
    }
  }

  private isSameLocation(location1: SearchLocation, location2: SearchLocation): boolean {
    const { latitude: lat1, longitude: long1 } = location1;
    const { latitude: lat2, longitude: long2 } = location2;

    return lat1 === lat2 && long1 === long2;
  }

  // TODO: We need to check if this format is valid for every type of location. This will be done when location filter is implemented
  private formatLabel(label: string) {
    const terms = label.split(',');

    if (terms.length >= 3) {
      return `${terms[2].trim()}, ${terms[0].trim()}`;
    }

    return label;
  }
}
