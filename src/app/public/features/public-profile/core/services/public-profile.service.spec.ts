import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import {
  MOCK_FULL_USER,
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
  USERS_STATS,
  USER_DATA,
  IMAGE,
} from '@fixtures/user.fixtures.spec';
import { environment } from 'environments/environment';

import {
  PublicProfileService,
  PROFILE_API_URL,
  USER_COVER_IMAGE_ENDPOINT,
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
      const expectedUrl = `${environment.baseUrl}${PROFILE_API_URL(
        userId
      )}/stats`;
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
    it('should get user reviews', () => {});
  });

  describe('when getting published items...', () => {
    it('should get user published items', () => {});
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
});
