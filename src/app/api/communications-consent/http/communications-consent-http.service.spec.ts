import { TestBed } from '@angular/core/testing';

import { CommunicationsConsentHttpService } from './communications-consent-http.service';
import { CommunicationsConsentResponseDto } from '@api/communications-consent/dtos/response/communications-consent-response-dto';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import {
  communicationsConsentIdToModify,
  communicationsConsentResponseFixture,
} from '@api/fixtures/comunications-consent/communications-consent-response.fixture';
import { COMMUNICATIONS_CONSENT_SET_ENDPOINT, COMMUNICATIONS_CONSENT_ENDPOINT } from '@api/communications-consent/http/endpoints';

describe('CommunicationsConsentHttpService', () => {
  let service: CommunicationsConsentHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunicationsConsentHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommunicationsConsentHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve notifications settings', () => {
    describe('notifications settings', () => {
      it('should retrieve notifications settings', () => {
        let response: CommunicationsConsentResponseDto;
        service.getMyNotificationsSettings().subscribe((res) => (response = res));
        const req: TestRequest = httpMock.expectOne(`${COMMUNICATIONS_CONSENT_ENDPOINT}`);
        req.flush(communicationsConsentResponseFixture);
        expect(response).toEqual(communicationsConsentResponseFixture);
      });

      it('should call disable notification', () => {
        service.setNotificationDisabled(communicationsConsentIdToModify).subscribe();
        const req: TestRequest = httpMock.expectOne(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${communicationsConsentIdToModify}/disable`);
        req.flush({});
        expect(req.request.url).toEqual(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${communicationsConsentIdToModify}/disable`);
        expect(req.request.method).toBe('POST');
      });

      it('should call enable notification', () => {
        service.setNotificationEnable(communicationsConsentIdToModify).subscribe();
        const req: TestRequest = httpMock.expectOne(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${communicationsConsentIdToModify}/enable`);
        req.flush({});
        expect(req.request.url).toEqual(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${communicationsConsentIdToModify}/enable`);
        expect(req.request.method).toBe('POST');
      });
    });
  });
});
