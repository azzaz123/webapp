import { TestBed } from '@angular/core/testing';

import { NotificationsHttpService } from './notifications-http.service';
import { NotificationsSettingsResponseDto } from '@api/notifications/dtos/response/notifcations-settings-response-dto';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { notificationIdToModify, notificationsSettingsResponseFixture } from '@api/fixtures/notifications/notifications-response.fixture';
import { BASE_SET_NOTIFICATION, NOTIFICATIONS_API_URL_ENDPOINT } from '@api/notifications/http/endpoints';

describe('NotificationsHttpService', () => {
  let service: NotificationsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificationsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve notifications settings', () => {
    describe('notifications settings', () => {
      it('should retrieve notifications settings', () => {
        let response: NotificationsSettingsResponseDto;
        service.getMyNotificationsSettings().subscribe((res) => (response = res));
        const req: TestRequest = httpMock.expectOne(`${NOTIFICATIONS_API_URL_ENDPOINT}`);
        req.flush(notificationsSettingsResponseFixture);
        expect(response).toEqual(notificationsSettingsResponseFixture);
      });

      it('should call disable notification', () => {
        service.setNotificationDisabled(notificationIdToModify).subscribe();
        const req: TestRequest = httpMock.expectOne(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/disable`);
        req.flush({});
        expect(req.request.url).toEqual(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/disable`);
        expect(req.request.method).toBe('POST');
      });

      it('should call enable notification', () => {
        service.setNotificationEnable(notificationIdToModify).subscribe();
        const req: TestRequest = httpMock.expectOne(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/enable`);
        req.flush({});
        expect(req.request.url).toEqual(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/enable`);
        expect(req.request.method).toBe('POST');
      });
    });
  });
});
