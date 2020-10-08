import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TrustAndSafetyService, USER_STARTER_ENDPOINT } from './trust-and-safety.service';
import { SessionProfileData, SessionProfileDataLocation, SessionProfileDataPlatform } from './trust-and-safety.interface';
import * as UUID from 'uuid';
import { environment } from 'environments/environment';
import { environment as prodEnv } from 'environments/environment.prod';

jest.mock('./threat-metrix-embed-script', () => ({
  __esModule: true,
  THREAT_METRIX_EMBED: `window["mockThreatMetrixEmbed"] = true;`
}));

jest.mock('uuid', () => {
  return { v4: () => null }
});

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

    spyOn(UUID, 'v4').and.returnValue(mockUUID);
  });

  afterEach(() => {
    httpMock.verify();
    window['tmx_profiling_started'] = false;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when submitting profile', () => {
    it('should inject ThreatMetrix SDK in the browser', () => {
      spyOn(document.head, 'appendChild').and.callThrough();

      service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);

      expect(window['mockThreatMetrixEmbed']).toBe(true);
      expect(document.head.appendChild).toHaveBeenCalledTimes(1);
    });

    it('should send valid information to wallapop server with same identifier', fakeAsync(() => {
      const expectedBody: SessionProfileData = {
        id: mockUUID,
        location: SessionProfileDataLocation.OPEN_CHAT,
        platform: SessionProfileDataPlatform.WEB
      };

      service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);
      tick(1000);
      mockThreatMetrixSDKProfileSentCallback();
      tick(1000);
      const postStarterRequest = httpMock.expectOne(USER_STARTER_ENDPOINT);
      postStarterRequest.flush({});

      expect(postStarterRequest.request.method).toBe('POST');
      expect(postStarterRequest.request.body).toEqual(expectedBody);
    }));

    describe('and when submitting again the profile', () => {
      it('should not load the ThreatMetrix SDK again', fakeAsync(() => {
        spyOn(document.head, 'appendChild').and.callThrough();

        service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);
        tick(1000);
        mockThreatMetrixSDKProfileSentCallback();
        tick(1000);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({});
        service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);
        httpMock.expectOne(USER_STARTER_ENDPOINT).flush({});

        expect(document.head.appendChild).toHaveBeenCalledTimes(1);
      }));
    });

    describe('and when the environment is production', () => {
      beforeEach(() => {
        environment.threatMetrixProfilingDomain = prodEnv.threatMetrixProfilingDomain;
        environment.threatMetrixOrgId = prodEnv.threatMetrixOrgId;
      });

      it('should start Threat Metrix profiling with production organization identifier', fakeAsync(() => {
        spyOn(wadgtlft, 'nfl');

        service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);
        tick(2000);
        discardPeriodicTasks();

        expect(wadgtlft.nfl).toHaveBeenCalledWith(prodEnv.threatMetrixProfilingDomain, prodEnv.threatMetrixOrgId, mockUUID);
      }));
    });

    describe('and when the environment is not production', () => {
      it('should start Threat Metrix profiling with development organization identifier', fakeAsync(() => {
        spyOn(wadgtlft, 'nfl');

        service.submitProfile(SessionProfileDataLocation.OPEN_CHAT);
        tick(2000);
        discardPeriodicTasks();

        expect(wadgtlft.nfl).toHaveBeenCalledWith(environment.threatMetrixProfilingDomain, environment.threatMetrixOrgId, mockUUID);
      }));
    });
  });
});
