import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { UserStats } from '@core/user/user-stats.interface';
import { ReviewResponse } from '@features/reviews/core/review-response.interface';
import { MOCK_USER_STATS, USERS_STATS } from '@fixtures/user.fixtures.spec';
import { environment } from 'environments/environment';

import {
  IS_FAROURITE_ENDPOINT,
  MARK_AS_FAVOURITE_ENDPOINT,
  PROFILE_API_URL,
  PublicUserApiService,
  PUBLISHED_ITEMS_ENDPOINT,
  REVIEWS_ENDPOINT,
  STATS_ENDPOINT,
  USER_COVER_IMAGE_ENDPOINT,
} from './public-user-api.service';
import { MarkAsFavouriteBodyRequest } from '@public/features/public-profile/core/interfaces/public-profile-request.interface';
import { PaginationResponse } from '../../pagination/pagination.interface';

describe('PublicUserApiService', () => {
  let publicUserApiService: PublicUserApiService;
  let httpMock: HttpTestingController;
  const userId = '123';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [PublicUserApiService],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    publicUserApiService = TestBed.inject(PublicUserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when getting stats...', () => {
    it('should get user stats', () => {
      const expectedUrl = `${environment.baseUrl}${STATS_ENDPOINT(userId)}`;

      publicUserApiService.getStats(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should return empty stats when we get an error', () => {
      const expectedUrl = `${environment.baseUrl}${STATS_ENDPOINT(userId)}`;

      publicUserApiService.getStats(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
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
      let response: PaginationResponse<ReviewResponse>;

      publicUserApiService.getReviews(userId).subscribe((r) => (response = r));
      const req = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should get user reviews with correct pagination', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_ENDPOINT(userId)}`;
      const itemsFrom = 40;
      let urlParams = '?init=' + itemsFrom;
      let response: PaginationResponse<ReviewResponse>;

      publicUserApiService
        .getReviews(userId, itemsFrom)
        .subscribe((r) => (response = r));
      const req = httpMock.expectOne(expectedUrl + urlParams);

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

      publicUserApiService.getPublishedItems(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl + urlParams);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should get user published items with correct pagination', () => {
      const expectedUrl = `${environment.baseUrl}${PUBLISHED_ITEMS_ENDPOINT(
        userId
      )}`;
      const itemsFrom = 40;
      let urlParams = '?init=' + itemsFrom;

      publicUserApiService.getPublishedItems(userId, itemsFrom).subscribe();
      const req = httpMock.expectOne(expectedUrl + urlParams);

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

      publicUserApiService.getUser(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting cover image...', () => {
    it('should return cover image', () => {
      const expectedUrl = `${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT(
        userId
      )}`;
      publicUserApiService.getCoverImage(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when requesting isFavourite', () => {
    const expectedUrl = `${environment.baseUrl}${IS_FAROURITE_ENDPOINT(
      userId
    )}`;

    it('should ask server for response', () => {
      publicUserApiService.isFavourite(userId).subscribe();

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

      publicUserApiService.markAsFavourite(userId).subscribe();

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

      publicUserApiService.unmarkAsFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });
});
