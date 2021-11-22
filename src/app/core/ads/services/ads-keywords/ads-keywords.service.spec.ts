import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MockUser, MockUserService } from '@fixtures/user.fixtures.spec';

import { AdsKeywordsService } from './ads-keywords.service';

const MOCK_BASE_ADSKEYWORDS = {
  brand: undefined,
  category: undefined,
  content: undefined,
  latitude: undefined,
  longitude: undefined,
  maxprice: undefined,
  minprice: undefined,
  MwebSearchLayout: undefined,
};

describe('AdsKeywordsService', () => {
  let service: AdsKeywordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: UserService,
          useValue: MockUserService,
        },
      ],
    });
    service = TestBed.inject(AdsKeywordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when updating keywords', () => {
    describe('and when the user is not logged in', () => {
      beforeEach(() => (MockUserService.user = null));

      it('should set keywords from browser location', () => {
        const MOCK_POSITION = {
          coords: {
            latitude: 1,
            longitude: 2,
          },
        };
        const EXPECTED_ADKEYWORDS = {
          ...MOCK_BASE_ADSKEYWORDS,
          latitude: MOCK_POSITION.coords.latitude.toString(),
          longitude: MOCK_POSITION.coords.longitude.toString(),
        };
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((callback) => callback(MOCK_POSITION));

        service.loadAdKeywords();

        expect(service.adKeywords).toEqual(EXPECTED_ADKEYWORDS);
      });

      it('should set keywords from browser cookies', () => {
        const EXPECTED_ADKEYWORDS = {
          ...MOCK_BASE_ADSKEYWORDS,
          brand: 'brand',
          content: 'content',
          category: 'category',
          minprice: 'minprice',
          maxprice: 'maxprice',
          MwebSearchLayout: 'MwebSearchLayout',
        };
        spyOn(MockCookieService, 'get').and.callFake((key) => key);

        service.loadAdKeywords();

        expect(service.adKeywords).toEqual(EXPECTED_ADKEYWORDS);
      });
    });

    describe('and when the user is logged in', () => {
      beforeEach(() => (MockUserService.user = MockUser));

      it('should set keywords from user', () => {
        const EXPECTED_ADKEYWORDS = {
          ...MOCK_BASE_ADSKEYWORDS,
          age: moment().diff(MockUser.birthDate, 'years').toString(),
          gender: MockUser.gender,
          userId: MockUser.id,
          latitude: MockUser.location.approximated_latitude.toString(),
          longitude: MockUser.location.approximated_longitude.toString(),
        };

        service.loadAdKeywords();

        expect(service.adKeywords).toEqual(EXPECTED_ADKEYWORDS);
      });
    });
  });

  describe('when save custom keywords', () => {
    it('should save keywords on cookies', () => {
      const EXPECTED_ADKEYWORDS = {
        ...MOCK_BASE_ADSKEYWORDS,
        brand: 'brand',
        content: 'content',
        category: 'category',
        minprice: 'minprice',
        maxprice: 'maxprice',
      };
      spyOn(MockCookieService, 'put').and.callThrough();

      service.saveCustomKeywords(EXPECTED_ADKEYWORDS);

      expect(MockCookieService.put).toHaveBeenCalledWith('brand', 'brand');
      expect(MockCookieService.put).toHaveBeenCalledWith('content', 'content');
      expect(MockCookieService.put).toHaveBeenCalledWith('category', 'category');
      expect(MockCookieService.put).toHaveBeenCalledWith('minprice', 'minprice');
      expect(MockCookieService.put).toHaveBeenCalledWith('maxprice', 'maxprice');
    });
  });
});
