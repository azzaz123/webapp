import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import {
  MOCK_FULL_USER,
  MOCK_FULL_USER_FEATURED,
  USERS_STATS,
  USER_DATA,
  IMAGE,
  MOCK_SHIPPING_COUNTER,
  MOCK_USER_STATS_WITH_SHIPPING,
} from '@fixtures/user.fixtures.spec';

import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { PublicProfileService } from './public-profile.service';
import { of } from 'rxjs';

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
              return of(MOCK_SHIPPING_COUNTER);
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

      expect(expectedResponse).toEqual(MOCK_USER_STATS_WITH_SHIPPING);
    });

    it('should return empty stats when we get an error', () => {
      let expectedResponse = {};
      spyOn(publicProfileService, 'getStats').and.returnValue(of(MOCK_USER_STATS_WITH_SHIPPING));

      publicProfileService.getStats(userId).subscribe((response: UserStats) => {
        expectedResponse = response;
      });

      expect(expectedResponse).toEqual(MOCK_USER_STATS_WITH_SHIPPING);
    });
  });

  describe('when getting favourite...', () => {
    it('should get user favourite', () => {
      spyOn(publicUserApiService, 'isFavourite');

      publicProfileService.isFavourite(userId);

      expect(publicUserApiService.isFavourite).toHaveBeenCalledWith(userId);
    });
  });

  describe('when getting reviews...', () => {
    it('should get user reviews', () => {
      spyOn(publicUserApiService, 'getReviews');

      publicProfileService.getReviews(userId);

      expect(publicUserApiService.getReviews).toHaveBeenCalledWith(userId, 0);
    });

    it('should get user reviews with correct pagination', () => {
      const itemsFrom = 40;
      spyOn(publicUserApiService, 'getReviews');

      publicProfileService.getReviews(userId, itemsFrom);

      expect(publicUserApiService.getReviews).toHaveBeenCalledWith(userId, itemsFrom);
    });
  });

  describe('when getting published items...', () => {
    it('should get user published items', () => {
      spyOn(publicUserApiService, 'getPublishedItems');

      publicProfileService.getPublishedItems(userId);

      expect(publicUserApiService.getPublishedItems).toHaveBeenCalledWith(userId, 0);
    });

    it('should get user published items with correct pagination', () => {
      const itemsFrom = 40;
      spyOn(publicUserApiService, 'getPublishedItems');

      publicProfileService.getPublishedItems(userId, itemsFrom);

      expect(publicUserApiService.getPublishedItems).toHaveBeenCalledWith(userId, itemsFrom);
    });
  });

  describe('when getting sold items...', () => {
    it('should get user sold items', () => {
      spyOn(publicUserApiService, 'getSoldItems');

      publicProfileService.getSoldItems(userId);

      expect(publicUserApiService.getSoldItems).toHaveBeenCalledWith(userId);
    });
  });

  describe('when getting buy transactions...', () => {
    it('should get user buy transactions', () => {
      spyOn(publicUserApiService, 'getBuyTransactions');

      publicProfileService.getBuyTransactions(userId);

      expect(publicUserApiService.getBuyTransactions).toHaveBeenCalledWith(userId);
    });
  });

  describe('when getting solds transactions...', () => {
    it('should get user solds transactions', () => {
      spyOn(publicUserApiService, 'getSoldsTransactions');

      publicProfileService.getSoldsTransactions(userId);

      expect(publicUserApiService.getSoldsTransactions).toHaveBeenCalledWith(userId);
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

  describe('when checking if user is pro...', () => {
    it('should return false if the user is NOT pro', () => {
      const MOCK_NORMAL_INFO = MOCK_FULL_USER;
      MOCK_NORMAL_INFO.featured = false;

      expect(publicProfileService.isPro(MOCK_NORMAL_INFO)).toBe(false);
    });
    it('should return true if the user is pro', () => {
      const MOCK_PRO_INFO = MOCK_FULL_USER;
      MOCK_PRO_INFO.featured = true;

      expect(publicProfileService.isPro(MOCK_PRO_INFO)).toBe(true);
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
