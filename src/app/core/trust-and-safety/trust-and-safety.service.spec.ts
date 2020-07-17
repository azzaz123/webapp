import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
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
  THREAT_METRIX_EMBED: `window["mockThreatMetrixEmbed"] = true;`
}));

describe('TrustAndSafetyService', () => {
  let service: TrustAndSafetyService;
  let httpMock: HttpTestingController;
  const mockUUID = 'very-cool-uuid-bruh';

  const mockThreatMetrixSDKProfileSentCallback = () => {
    window['tmx_profiling_started'] = true;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrustAndSafetyService]
    });
    service = TestBed.inject(TrustAndSafetyService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(UUID, 'UUID').and.returnValue(mockUUID);
  });

  afterEach(() => {
    httpMock.verify();
    window['tmx_profiling_started'] = false;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when trying to submit profile', () => {
    describe('and when user is a starter user', () => {
      it('should inject ThreatMetrix with SDK in the DOM', () => {
        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);

        expect(window['mockThreatMetrixEmbed']).toBe(true);
      });

      it('should send valid information to wallapop server only once with same identifier', fakeAsync(() => {
        const expectedBody: SessionProfileData = {
          id: mockUUID,
          location: SessionProfileDataLocation.OPEN_CHAT,
          platform: SessionProfileDataPlatform.WEB
        };

        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
        tick(1000);
        mockThreatMetrixSDKProfileSentCallback();
        tick(1000);
        const postStarterRequest = httpMock.expectOne(USER_STARTER_ENDPOINT);
        postStarterRequest.flush({});

        expect(postStarterRequest.request.method).toBe('POST');
        expect(postStarterRequest.request.body).toEqual(expectedBody);
      }));

      describe('and when the environment is production', () => {
        beforeEach(() => {
          environment.threatMetrixProfilingDomain = prodEnv.threatMetrixProfilingDomain;
          environment.threatMetrixOrgId = prodEnv.threatMetrixOrgId;
        });

        it('should start Threat Metrix profiling with production organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(2000);
          discardPeriodicTasks();

          expect(wadgtlft.nfl).toHaveBeenCalledWith(prodEnv.threatMetrixProfilingDomain, prodEnv.threatMetrixOrgId, mockUUID);
        }));
      });

      describe('and when the environment is not production', () => {
        it('should start Threat Metrix profiling with development organization identifier', fakeAsync(() => {
          spyOn(wadgtlft, 'nfl');

          service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_STARTER_USER_RESPONSE);
          tick(2000);
          discardPeriodicTasks();

          expect(wadgtlft.nfl).toHaveBeenCalledWith(environment.threatMetrixProfilingDomain, environment.threatMetrixOrgId, mockUUID);
        }));
      });

      describe('and when wallapop backend notifies that user is no starter anymore', () => {
        it('should not do anything else', () => {
          service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
          httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

          service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);

          httpMock.expectNone(USER_STARTER_ENDPOINT);
        });
      });
    });

    describe('and when user is not a starter user', () => {
      it('should ask to wallapop server and then do nothing else', () => {
        spyOn(document.head, 'appendChild');
        spyOn(wadgtlft, 'nfl');

        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush(MOCK_NON_STARTER_USER_RESPONSE);

        httpMock.expectNone(USER_STARTER_ENDPOINT);
        expect(document.head.appendChild).not.toHaveBeenCalled();
        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });

    describe('and when wallapop server is down', () => {
      it('should ask to wallapop server if user is starter and then do nothing else', () => {
        spyOn(document.head, 'appendChild');
        spyOn(wadgtlft, 'nfl');

        service.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({}, { status: 500, statusText: 'Error' });

        httpMock.expectNone(USER_STARTER_ENDPOINT);
        expect(document.head.appendChild).not.toHaveBeenCalled();
        expect(wadgtlft.nfl).not.toHaveBeenCalled();
      });
    });
  });
});
