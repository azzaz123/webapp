import { TestBed } from '@angular/core/testing';

import { QueryStringLocationService } from './query-string-location.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { CookieService } from 'ngx-cookie';
import { SEO_COOKIE_LOCATION_KEY } from '@public/features/search/core/services/enums/seo-cookie-location-key.enum';
import { SEARCH_LOCATION_KEY } from '@public/features/search/core/services/enums/local-storage-location-key.enum';
import { LOCALE_ID } from '@angular/core';

describe('QueryStringLocationService', () => {
  let service: QueryStringLocationService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryStringLocationService,
        {
          provide: LOCALE_ID,
          useValue: 'es',
        },
        {
          provide: CookieService,
          useValue: {
            get: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(QueryStringLocationService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for correct location', () => {
    describe('and no querystring location present', () => {
      describe('and cookie location present', () => {
        it('should keep cookie location', () => {
          spyOn(cookieService, 'get').and.returnValues('0', '0');
          spyOn(localStorage, 'getItem').and.returnValues('10', '10');

          const location = service.getLocationParameters();

          expect(location).toEqual({
            latitude: '0',
            longitude: '0',
          });

          expect(cookieService.get).toHaveBeenCalledTimes(2);
          expect(cookieService.get).toHaveBeenCalledWith(SEO_COOKIE_LOCATION_KEY.LATITUDE);
          expect(cookieService.get).toHaveBeenCalledWith(SEO_COOKIE_LOCATION_KEY.LONGITUDE);
          expect(localStorage.getItem).toHaveBeenCalledTimes(0);
        });
      });

      describe('and no cookie location present', () => {
        describe('and localStorage location present', () => {
          it('should keep localStorage location', () => {
            spyOn(cookieService, 'get').and.returnValues(undefined, undefined);
            spyOn(localStorage, 'getItem').and.returnValues('10', '10');

            const location = service.getLocationParameters();

            expect(location).toEqual({
              latitude: '10',
              longitude: '10',
            });

            expect(cookieService.get).toHaveBeenCalledTimes(2);
            expect(localStorage.getItem).toHaveBeenCalledTimes(2);
            expect(localStorage.getItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LATITUDE);
            expect(localStorage.getItem).toHaveBeenCalledWith(SEARCH_LOCATION_KEY.LONGITUDE);
          });
        });

        describe('and no localStorage location present', () => {
          it('should keep subdomain default value', () => {
            spyOn(cookieService, 'get').and.returnValues(undefined, undefined);
            spyOn(localStorage, 'getItem').and.returnValues(undefined, undefined);

            const location = service.getLocationParameters();
            const expectedLocation = {
              longitude: DEFAULT_LOCATIONS.es[FILTER_QUERY_PARAM_KEY.longitude],
              latitude: DEFAULT_LOCATIONS.es[FILTER_QUERY_PARAM_KEY.latitude],
            };

            expect(location).toEqual(expectedLocation);
            expect(cookieService.get).toHaveBeenCalledTimes(2);
            expect(localStorage.getItem).toHaveBeenCalledTimes(2);
          });
        });
      });
    });
  });
});
