import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import {
  MOCK_USER_INFO,
  MOCK_USER_STATS,
  USERS_STATS,
} from '@public/fixtures/public-profile.fixtures.spec';
import { UserInfo, UserStats } from '../public-profile.interface';
import { environment } from 'environments/environment';

import {
  PublicProfileService,
  PROFILE_API_URL,
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
      let response: UserInfo;

      service.getUser(userId).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_USER_INFO);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_USER_INFO);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when getting info from pro user...', () => {
    it('should get info pro user', () => {});
  });

  describe('when checking if user is pro...', () => {
    it('should return false if the user is NOT pro', () => {
      expect(service.isPro(MOCK_USER_INFO)).toBe(false);
    });
    it('should return true if the user is pro', () => {
      const MOCK_PRO_INFO = MOCK_USER_INFO;
      MOCK_PRO_INFO.featured = true;

      expect(service.isPro(MOCK_PRO_INFO)).toBe(true);
    });
  });
});
