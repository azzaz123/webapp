import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TrustAndSafetyService, USER_STARTER_ENDPOINT } from './trust-and-safety.service';
import {
  MOCK_STARTER_USER_RESPONSE,
  MOCK_NON_STARTER_USER_RESPONSE,
} from './trust-and-safety.fixtures.spec';

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
      req.flush(MOCK_STARTER_USER_RESPONSE);

      expect(isStarter).toEqual(MOCK_STARTER_USER_RESPONSE.starter);
      expect(req.request.urlWithParams).toBe(USER_STARTER_ENDPOINT);
      expect(req.request.method).toBe('GET');
    });

    it('should NOT ask server when already asked previously', () => {
      let isStarter: boolean;

      service.isStarterUser().subscribe();
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
      service.isStarterUser().subscribe(r => isStarter = r);

      httpMock.expectNone(USER_STARTER_ENDPOINT);
      expect(isStarter).toEqual(MOCK_STARTER_USER_RESPONSE.starter);
    });

    it('should ask server if not using cache and already saved', () => {
      let isStarter: boolean;

      service.isStarterUser().subscribe();
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
      service.isStarterUser(false).subscribe(r => isStarter = r);
      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);

      expect(isStarter).toEqual(MOCK_STARTER_USER_RESPONSE.starter);
    });
  });

  describe('when initializing profiling', () => {
    it('should ask server if user is starter', () => {
      service.initializeProfiling();

      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);
    });

    describe('and when the user is starter', () => {
      xit('should start Threat Metrix', () => {
        spyOn(threadMetrixLibrary, 'profile');

        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);

        expect(threadMetrixLibrary.profile).toHaveBeenCalled();
      });
    });

    describe('and when the user is not an starter', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(threadMetrixLibrary, 'profile');

        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        expect(threadMetrixLibrary.profile).not.toHaveBeenCalled();
      });
    });

    describe('and when the server does not respond', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(threadMetrixLibrary, 'profile');

        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({}, { status: 500, statusText: 'Error' });

        expect(threadMetrixLibrary.profile).not.toHaveBeenCalled();
      });
    });
  });
});
