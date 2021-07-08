import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';

import {
  GET_EXTRA_INFO_ENDPOINT,
  IS_FAVOURITE_ENDPOINT,
  MARK_AS_FAVOURITE_ENDPOINT,
  PROFILE_API_URL,
  PublicUserApiService,
  SHIPPING_COUNTER_ENDPOINT,
  STATS_ENDPOINT,
  USER_COVER_IMAGE_ENDPOINT,
} from './public-user-api.service';
import { MarkAsFavouriteBodyRequest } from '@public/features/public-profile/core/interfaces/public-profile-request.interface';

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

  describe('when getting shipping counter...', () => {
    it('should get user shipping counter', () => {
      const expectedUrl = `${environment.baseUrl}${SHIPPING_COUNTER_ENDPOINT(userId)}`;

      publicUserApiService.getShippingCounter(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
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
      const expectedUrl = `${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT(userId)}`;
      publicUserApiService.getCoverImage(userId).subscribe();
      const req = httpMock.expectOne(expectedUrl);

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when requesting isFavourite', () => {
    const expectedUrl = `${environment.baseUrl}${IS_FAVOURITE_ENDPOINT(userId)}`;

    it('should ask server for response', () => {
      publicUserApiService.isFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('when requesting extra info', () => {
    const expectedUrl = `${environment.baseUrl}${GET_EXTRA_INFO_ENDPOINT(userId)}`;

    it('should ask server for response', () => {
      publicUserApiService.getExtraInfo(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.body).toBeNull();
    });
  });

  describe('when requesting markAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: true };
      const expectedUrl = `${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(userId)}`;

      publicUserApiService.markAsFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });

  describe('when requesting unmarkAsFavourite', () => {
    it('should ask server for response', () => {
      const bodyRequest: MarkAsFavouriteBodyRequest = { favorited: false };
      const expectedUrl = `${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(userId)}`;

      publicUserApiService.unmarkAsFavourite(userId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(bodyRequest);
    });
  });
});
