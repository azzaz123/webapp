import { HttpResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ItemResponse } from '@core/item/item-response.interface';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { ReviewsData } from '@features/reviews/core/review-response.interface';
import {
  MOCK_FULL_USER,
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
  USERS_STATS,
  USER_DATA,
  IMAGE,
} from '@fixtures/user.fixtures.spec';
import { environment } from 'environments/environment';
import { MarkAsFavouriteBodyRequest } from '../interfaces/public-profile-request.interface';

import {
  PublicProfileService,
  PROFILE_API_URL,
  USER_COVER_IMAGE_ENDPOINT,
  STATS_ENDPOINT,
  REVIEWS_ENDPOINT,
  IS_FAROURITE_ENDPOINT,
  MARK_AS_FAVOURITE_ENDPOINT,
  PUBLISHED_ITEMS_ENDPOINT,
} from './public-profile.service';

describe('PublicProfileService', () => {
  let service: PublicProfileService;
  let httpMock: HttpTestingController;
  const userId = '123';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [PublicProfileService],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(PublicProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when getting stats...', () => {
    it('should get user stats', () => {
      const expectedUrl = `${environment.baseUrl}${STATS_ENDPOINT(userId)}`;
      let response: UserStats;

      service.getStats(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(USERS_STATS);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_USER_STATS);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting favourite...', () => {
    it('should get user favourite', () => {});
  });

  describe('when getting reviews...', () => {
    it('should get user reviews', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_ENDPOINT(userId)}`;
      let urlParams = '?init=0';
      let response: HttpResponse<ReviewsData[]>;

      service.getReviews(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should get user reviews with correct pagination', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_ENDPOINT(userId)}`;
      const randomNum = 40;
      let urlParams = '?init=' + randomNum;
      let response: HttpResponse<ReviewsData[]>;

      service.getReviews(userId, randomNum).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting published items...', () => {
    it('should get user published items', () => {
      const expectedUrl = `${environment.baseUrl}${PUBLISHED_ITEMS_ENDPOINT(
        userId
      )}`;
      let urlParams = '?init=0';
      let response: HttpResponse<ItemResponse[]>;

      service.getPublishedItems(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should get user published items with correct pagination', () => {
      const expectedUrl = `${environment.baseUrl}${PUBLISHED_ITEMS_ENDPOINT(
        userId
      )}`;
      const randomNum = 40;
      let urlParams = '?init=' + randomNum;
      let response: HttpResponse<ItemResponse[]>;

      service
        .getPublishedItems(userId, randomNum)
        .subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting sold items...', () => {
    it('should get user sold items', () => {});
  });

  describe('when getting buy transactions...', () => {
    it('should get user buy transactions', () => {});
  });

  describe('when getting solds transactions...', () => {
    it('should get user solds transactions', () => {});
  });

  describe('when getting user...', () => {
    it('should get user', () => {
      const expectedUrl = `${environment.baseUrl}${PROFILE_API_URL(userId)}`;
      let response: User;

      service.getUser(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(USER_DATA);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_FULL_USER_FEATURED);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting info from pro user...', () => {
    it('should get info pro user', () => {});
  });

  describe('when checking if user is pro...', () => {
    it('should return false if the user is NOT pro', () => {
      const MOCK_NORMAL_INFO = MOCK_FULL_USER;
      MOCK_NORMAL_INFO.featured = false;

      expect(service.isPro(MOCK_NORMAL_INFO)).toBe(false);
    });
    it('should return true if the user is pro', () => {
      const MOCK_PRO_INFO = MOCK_FULL_USER;
      MOCK_PRO_INFO.featured = true;

      expect(service.isPro(MOCK_PRO_INFO)).toBe(true);
    });
  });

  describe('when getting cover image...', () => {
    it('should return cover image', () => {
      const expectedUrl = `${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT(
        userId
      )}`;
      let response: Image;

      service.getCoverImage(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(IMAGE);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(IMAGE);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when requesting isFavourite', () => {
    const expectedUrl = `${environment.baseUrl}${IS_FAROURITE_ENDPOINT(
      userId
    )}`;

    it('should ask server for response', () => {
      service.isFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('when requesting markAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: true };
      const expectedUrl = `${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(
        userId
      )}`;

      service.markAsFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });

  describe('when requesting unmarkAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: false };
      const expectedUrl = `${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(
        userId
      )}`;

      service.unmarkAsFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });
});
