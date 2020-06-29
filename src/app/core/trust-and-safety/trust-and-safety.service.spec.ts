import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TrustAndSafetyService, USER_STARTER_ENDPOINT } from './trust-and-safety.service';
import {
  MOCK_STARTER_USER_RESPONSE,
  MOCK_NON_STARTER_USER_RESPONSE,
} from './trust-and-safety.fixtures.spec';
import { SessionProfileData } from './trust-and-safety.interface';
import { UUID } from 'angular2-uuid';
import { environment } from 'environments/environment';

jest.mock('./threat-metrix-embed-script', () => ({
  __esModule: true,
  THREAT_METRIX_EMBED: ''
}));

describe('TrustAndSafetyService', () => {
  let service: TrustAndSafetyService;
  let httpMock: HttpTestingController;
  const mockUUID = 'very-cool-uuid-bruh';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrustAndSafetyService]
    });
    service = TestBed.inject(TrustAndSafetyService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(UUID, 'UUID').and.returnValue(mockUUID);
  });

  beforeEach(fakeAsync(() => {
    tick(50);
    window['tmx_profiling_started'] = true; // set by SDK when ready
  }));

  afterEach(() => {
    httpMock.verify();
    window['tmx_profiling_started'] = false;
  });

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
      describe('and when the environment is production', () => {
        it('should start Threat Metrix profiling with production organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.initializeProfiling();
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(1000);

          expect(wadgtlft.nfl).toHaveBeenCalledWith('h.online-metrix.net', environment.threatMetrixOrgId, mockUUID);
        }));
      });

      describe('and when the environment is not production', () => {
        it('should start Threat Metrix profiling with development organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.initializeProfiling();
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(1000);

          expect(wadgtlft.nfl).toHaveBeenCalledWith('h.online-metrix.net', environment.threatMetrixOrgId, mockUUID);
        }));
      });
    });

    describe('and when the user is not an starter', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(wadgtlft, 'nfl');

        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });

    describe('and when the server does not respond', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(wadgtlft, 'nfl');

        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({}, { status: 500, statusText: 'Error' });

        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });
  });

  describe('when sending profiling to server', () => {
    describe('and when the user is an starter user', () => {
      it('should send valid information only once with same identifier', fakeAsync(() => {
        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
        const expectedBody: SessionProfileData = {
          id: mockUUID,
          location: 'OpenChat',
          platform: 'Web'
        };
        tick(1000);

        service.submitProfile('OpenChat').subscribe();
        const req = httpMock.expectOne(USER_STARTER_ENDPOINT);
        req.flush({});

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(expectedBody);
      }));
    });

    describe('and when the user is a non starter user', () => {
      it('should fail', () => {
        service.initializeProfiling();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        expect(() => service.submitProfile('OpenChat')).toThrowError();
      });
    });
  });
});
