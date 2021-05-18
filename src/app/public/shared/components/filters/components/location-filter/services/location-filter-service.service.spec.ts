import { TestBed } from '@angular/core/testing';

import { LocationFilterService } from './location-filter-service.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { SEARCH_LOCATION_KEY } from '@public/features/search/core/services/enums/local-storage-location-key.enum';
import { SEO_COOKIE_LOCATION_KEY } from '@public/features/search/core/services/enums/seo-cookie-location-key.enum';
import { of } from 'rxjs/internal/observable/of';

describe('LocationFilterServiceService', () => {
  let service: LocationFilterService;
  let geolocationService: GeolocationService;
  let cookieService: CookieService;

  const { latitude, longitude, label } = DEFAULT_LOCATIONS.es;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationFilterService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: GeolocationService,
          useValue: {
            reverseGeocode: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(LocationFilterService);
    geolocationService = TestBed.inject(GeolocationService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting a location', () => {
    it('should save location to local storage', () => {
      spyOn(localStorage, 'setItem');

      service.setUserLocation({ latitude, longitude, label });

      expect(localStorage.setItem).toHaveBeenCalledTimes(3);
      expect(localStorage.setItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LATITUDE, latitude);
      expect(localStorage.setItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LONGITUDE, longitude);
      expect(localStorage.setItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LABEL, label);
    });
  });

  describe('when retrieving an unknown location label', () => {
    describe('and location is in seo cookies', () => {
      it('should return cookie saved label', () => {
        spyOn(cookieService, 'get').and.returnValues(latitude, longitude, label);
        spyOn(geolocationService, 'reverseGeocode');

        let retrievedLabel;
        service.getLocationLabel({ latitude, longitude }).subscribe((val) => (retrievedLabel = val));

        expect(retrievedLabel).toEqual(label);
        expect(cookieService.get).toHaveBeenCalledTimes(3);
        expect(cookieService.get).toHaveBeenCalledWith(SEO_COOKIE_LOCATION_KEY.LATITUDE);
        expect(cookieService.get).toHaveBeenCalledWith(SEO_COOKIE_LOCATION_KEY.LONGITUDE);
        expect(cookieService.get).toHaveBeenCalledWith(SEO_COOKIE_LOCATION_KEY.LABEL);
        expect(geolocationService.reverseGeocode).toHaveBeenCalledTimes(0);
      });
    });

    describe('and location is in local storage', () => {
      it('should retrieve location storage location label', () => {
        spyOn(localStorage, 'getItem').and.returnValues(latitude, longitude, label);
        spyOn(geolocationService, 'reverseGeocode');

        let retrievedLabel;
        service.getLocationLabel({ latitude, longitude }).subscribe((val) => (retrievedLabel = val));

        expect(retrievedLabel).toEqual(label);
        expect(localStorage.getItem).toHaveBeenCalledTimes(3);
        expect(localStorage.getItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LATITUDE);
        expect(localStorage.getItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LONGITUDE);
        expect(localStorage.getItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LABEL);
        expect(geolocationService.reverseGeocode).toHaveBeenCalledTimes(0);
      });
    });

    describe('and location is part of the default locations array', () => {
      it('should retrieve default location label', () => {
        spyOn(geolocationService, 'reverseGeocode');

        let retrievedLabel;
        service.getLocationLabel({ latitude, longitude }).subscribe((val) => (retrievedLabel = val));

        expect(retrievedLabel).toEqual(label);
        expect(geolocationService.reverseGeocode).toHaveBeenCalledTimes(0);
      });
    });

    describe('and location is not present anywhere', () => {
      it('should retrieve label from reverseGeocode', () => {
        spyOn(geolocationService, 'reverseGeocode').and.returnValue(of('London, 0000, UK'));

        let retrievedLabel;
        service.getLocationLabel({ latitude: '0', longitude: '0' }).subscribe((val) => (retrievedLabel = val));

        expect(retrievedLabel).toEqual('UK, London');
        expect(geolocationService.reverseGeocode).toHaveBeenCalledTimes(1);
        expect(geolocationService.reverseGeocode).toHaveBeenCalledWith('0', '0');
      });

      describe('and the label comes with different format', () => {
        it('should avoid formatting the label', () => {
          spyOn(geolocationService, 'reverseGeocode').and.returnValue(of('London, UK'));

          let retrievedLabel;
          service.getLocationLabel({ latitude: '0', longitude: '0' }).subscribe((val) => (retrievedLabel = val));

          expect(retrievedLabel).toEqual('London, UK');
          expect(geolocationService.reverseGeocode).toHaveBeenCalledTimes(1);
          expect(geolocationService.reverseGeocode).toHaveBeenCalledWith('0', '0');
        });
      });
    });
  });
});
