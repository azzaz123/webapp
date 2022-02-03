import { TestBed } from '@angular/core/testing';

import { NotificationsApiService } from './notifications-api.service';
import { NotificationSettings } from '@api/core/model/notifications';
import { of } from 'rxjs';
import {
  notificationIdToModify,
  notificationsSettingsResponseFixture,
} from '@api/fixtures/me/notifications/notifications-response.fixture';
import { mappedNotificationsSettings } from '@api/fixtures/me/notifications/notifications.fixture';
import { NotificationsHttpService } from '@api/notifications/http/notifications-http.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationsApiService', () => {
  let service: NotificationsApiService;
  let httpService: NotificationsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsApiService,
        NotificationsHttpService,
        {
          provide: I18nService,
          useValue: {
            translate: (key: TRANSLATION_KEY) => {
              return key;
            },
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NotificationsApiService);
    httpService = TestBed.inject(NotificationsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for notifications settings', () => {
    it('should retrieve notifications items', () => {
      let notificationsSettings: NotificationSettings[];
      spyOn(httpService, 'getMyNotificationsSettings').and.returnValue(of(notificationsSettingsResponseFixture));
      service.getMyNotificationsSettings().subscribe((data: NotificationSettings[]) => (notificationsSettings = data));
      expect(notificationsSettings).toEqual(mappedNotificationsSettings);
    });

    it('should disable notification', (done) => {
      spyOn(httpService, 'setNotificationDisabled').and.returnValue(of(null));
      service.setNotificationDisabled(`${notificationIdToModify}`).subscribe(() => {
        done();
      });
    });

    it('should enable notification', (done) => {
      spyOn(httpService, 'setNotificationEnable').and.returnValue(of(null));
      service.setNotificationEnable(`${notificationIdToModify}`).subscribe(() => {
        done();
      });
    });
  });
});
