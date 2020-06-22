import { TestBed } from '@angular/core/testing';

import { TrustAndSafetyService, USER_STARTER_ENDPOINT } from './trust-and-safety.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER, MOCK_IS_STARTER_RESPONSE_WITH_NON_STARTER_USER } from './trust-and-safety.fixtures.spec';

describe('TrustAndSafetyService', () => {
  let service: TrustAndSafetyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrustAndSafetyService]
    });
    service = TestBed.inject(TrustAndSafetyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking server if user is an starter user', () => {
    it('should ask server for the first time and get if user is starter', () => {
      let isStarter: boolean;

      service.isStarterUser().subscribe(r => isStarter = r);
      const req = httpMock.expectOne(USER_STARTER_ENDPOINT);
      req.flush(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER);

      expect(isStarter).toEqual(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER.starter);
      expect(req.request.urlWithParams).toBe(USER_STARTER_ENDPOINT);
      expect(req.request.method).toBe('GET');
    });

    it('should NOT ask server when already asked previously', () => {
      let isStarter: boolean;

      service.isStarterUser().subscribe();
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER);
      service.isStarterUser().subscribe(r => isStarter = r);

      httpMock.expectNone(USER_STARTER_ENDPOINT);
      expect(isStarter).toEqual(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER.starter);
    });

    it('should ask server if not using cache and already saved', () => {
      let isStarter: boolean;

      service.isStarterUser().subscribe();
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER);
      service.isStarterUser(false).subscribe(r => isStarter = r);
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER);

      expect(isStarter).toEqual(MOCK_IS_STARTER_RESPONSE_WITH_STARTER_USER.starter);
    });
  });

  describe('when initializing profiling', () => {
    it('should ask server if user is starter', () => {
      service.initializeProfiling();

      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_IS_STARTER_RESPONSE_WITH_NON_STARTER_USER);
    });

    describe('and when the user is starter', () => {
      it('should start Threat Metrix', () => {

      });
    });

    describe('and when the user is not an starter', () => {
      it('should not initialize Threat Metrix', () => {

      });
    });

    describe('and when the server does not respond', () => {
      it('should not initialize Threat Metrix', () => {

      });
    });
  });

  describe('when sending profiling to server', () => {
    it('should send valid information only once', () => {

    });
  });
});
