import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { EMPTY_STATS } from './constants/stats-constants';
import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
  USERS_STATS,
  USER_DATA,
  IMAGE,
  MOCK_USER_SHIPPING_COUNTER,
} from '@fixtures/user.fixtures.spec';

import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { PublicProfileService } from './public-profile.service';
import { of, throwError } from 'rxjs';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';

describe('PublicProfileService', () => {
  let publicProfileService: PublicProfileService;
  let publicUserApiService: PublicUserApiService;
  let httpMock: HttpTestingController;
  const userId = '123';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        PublicProfileService,
        {
          provide: PublicUserApiService,
          useValue: {
            getUser() {
              return of(USER_DATA);
            },
            getStats() {
              return of(USERS_STATS);
            },
            getShippingCounter() {
              return of(MOCK_USER_SHIPPING_COUNTER);
            },
            getCoverImage() {
              return of(IMAGE);
            },
            getReviews() {
              return of();
            },
            getPublishedItems() {
              return of();
            },
            getSoldItems() {
              return of();
            },
            getBuyTransactions() {
              return of();
            },
            getSoldsTransactions() {
              return of();
            },
            isFavourite() {
              return of();
            },
            getExtraInfo() {
              return of();
            },
            markAsFavourite() {
              return of();
            },
            unmarkAsFavourite() {
              return of();
            },
          },
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    publicProfileService = TestBed.inject(PublicProfileService);
    publicUserApiService = TestBed.inject(PublicUserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when getting stats...', () => {
    it('should get user stats', () => {
      let expectedResponse = {};

      publicProfileService.getStats(userId).subscribe((response: UserStats) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(MOCK_USER_STATS);
    });

    it('should return empty stats when we get an error', () => {
      let expectedResponse: UserStats;
      spyOn(publicUserApiService, 'getStats').and.returnValue(throwError('network error'));

      publicProfileService.getStats(userId).subscribe((response: UserStats) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(EMPTY_STATS);
    });
  });

  describe('when getting shipping counter...', () => {
    it('should get user shipping counter', () => {
      let expectedResponse: number;

      publicProfileService.getShippingCounter(userId).subscribe((response: number) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(MOCK_USER_SHIPPING_COUNTER.succeeded_count);
    });

    it('should return zero when we get an error', () => {
      let expectedResponse: number;
      spyOn(publicUserApiService, 'getShippingCounter').and.returnValue(throwError('network error'));

      publicProfileService.getShippingCounter(userId).subscribe((response: number) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(0);
    });
  });

  describe('when getting favourite...', () => {
    it('should get user favourite', () => {
      spyOn(publicUserApiService, 'isFavourite');

      publicProfileService.isFavourite(userId);

      expect(publicUserApiService.isFavourite).toHaveBeenCalledWith(userId);
    });
  });

  describe('when getting user...', () => {
    it('should get user', () => {
      let expectedResponse = {};

      publicProfileService.getUser(userId).subscribe((response: User) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(MOCK_FULL_USER_FEATURED);
    });
  });

  describe('when getting cover image...', () => {
    it('should return cover image', () => {
      let expectedResponse = {};

      publicProfileService.getCoverImage(userId).subscribe((response: Image) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(IMAGE);
    });
  });

  describe('when getting extra info...', () => {
    it('should return user extra info', () => {
      spyOn(publicUserApiService, 'getExtraInfo');

      publicProfileService.getExtraInfo(userId);

      expect(publicUserApiService.getExtraInfo).toHaveBeenCalledWith(userId);
    });
  });

  describe('when requesting isFavourite', () => {
    it('should ask server for response', () => {
      spyOn(publicUserApiService, 'isFavourite');

      publicProfileService.isFavourite(userId);

      expect(publicUserApiService.isFavourite).toHaveBeenCalledWith(userId);
    });
  });

  describe('when requesting markAsFavourite', () => {
    it('should ask server for response', () => {
      spyOn(publicUserApiService, 'markAsFavourite');

      publicProfileService.markAsFavourite(userId);

      expect(publicUserApiService.markAsFavourite).toHaveBeenCalledWith(userId);
    });
  });

  describe('when requesting unmarkAsFavourite', () => {
    it('should ask server for response', () => {
      spyOn(publicUserApiService, 'unmarkAsFavourite');

      publicProfileService.unmarkAsFavourite(userId);

      expect(publicUserApiService.unmarkAsFavourite).toHaveBeenCalledWith(userId);
    });
  });
});
