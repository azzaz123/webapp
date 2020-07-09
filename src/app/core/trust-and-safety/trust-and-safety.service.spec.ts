import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TrustAndSafetyService, USER_STARTER_ENDPOINT } from './trust-and-safety.service';
import {
  MOCK_STARTER_USER_RESPONSE,
  MOCK_NON_STARTER_USER_RESPONSE,
} from './trust-and-safety.fixtures.spec';
import { SessionProfileData, SessionProfileDataLocation, SessionProfileDataPlatform } from './trust-and-safety.interface';
import { UUID } from 'angular2-uuid';
import { environment } from 'environments/environment';
import { environment as prodEnv } from 'environments/environment.prod';

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

  describe('when initializing profiling', () => {
    it('should ask server if user is starter', () => {
      service.initializeProfilingIfNeeded();

      httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);
    });

    describe('and when the user is starter', () => {
      describe('and when the environment is production', () => {
        beforeEach(() => {
          environment.threatMetrixProfilingDomain = prodEnv.threatMetrixProfilingDomain;
          environment.threatMetrixOrgId = prodEnv.threatMetrixOrgId;
        });

        it('should start Threat Metrix profiling with production organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.initializeProfilingIfNeeded();
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(1000);

          expect(wadgtlft.nfl).toHaveBeenCalledWith(prodEnv.threatMetrixProfilingDomain, prodEnv.threatMetrixOrgId, mockUUID);
        }));
      });

      describe('and when the environment is not production', () => {
        it('should start Threat Metrix profiling with development organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.initializeProfilingIfNeeded();
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(1000);

          expect(wadgtlft.nfl).toHaveBeenCalledWith(environment.threatMetrixProfilingDomain, environment.threatMetrixOrgId, mockUUID);
        }));
      });
    });

    describe('and when the user is not an starter', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(wadgtlft, 'nfl');

        service.initializeProfilingIfNeeded();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });

    describe('and when the server does not respond', () => {
      it('should not initialize Threat Metrix', () => {
        spyOn(wadgtlft, 'nfl');

        service.initializeProfilingIfNeeded();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({}, { status: 500, statusText: 'Error' });

        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });
  });

  describe('when submiting profiling to wallapop server', () => {
    describe('and when the user is an starter user', () => {
      it('should send valid information only once with same identifier', fakeAsync(() => {
        service.initializeProfilingIfNeeded();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
        const expectedBody: SessionProfileData = {
          id: mockUUID,
          location: SessionProfileDataLocation.OPEN_CHAT,
          platform: SessionProfileDataPlatform.WEB
        };
        tick(1000);

        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
        const postStarterRequest = httpMock.expectOne(USER_STARTER_ENDPOINT);
        postStarterRequest.flush({});

        expect(postStarterRequest.request.method).toBe('POST');
        expect(postStarterRequest.request.body).toEqual(expectedBody);
      }));

      describe('and when the ThreatMetrix profile has not been sent yet', () => {
        it('should wait to ThreatMetrix profile sent and then submit profile to wallapop server', fakeAsync(() => {
          service.initializeProfilingIfNeeded();
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          const expectedBody: SessionProfileData = {
            id: mockUUID,
            location: SessionProfileDataLocation.OPEN_CHAT,
            platform: SessionProfileDataPlatform.WEB
          };

          service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
          tick(5000);
          window['tmx_profiling_started'] = true;
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          const postStarterRequest = httpMock.expectOne(USER_STARTER_ENDPOINT);
          postStarterRequest.flush({});

          expect(postStarterRequest.request.method).toBe('POST');
          expect(postStarterRequest.request.body).toEqual(expectedBody);
        }));
      });
    });

    describe('and when the user is a non starter user', () => {
      it('should do nothing', () => {
        service.initializeProfilingIfNeeded();
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        httpMock.expectNone(USER_STARTER_ENDPOINT);
      });
    });
  });
});
