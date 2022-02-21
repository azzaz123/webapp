import { TestBed } from '@angular/core/testing';

import { NotificationApiService } from './notification-api.service';
import { NotificationSettings } from '@api/core/model/notifications';
import { of } from 'rxjs';
import { notificationIdToModify, notificationsSettingsResponseFixture } from '@api/fixtures/notifications/notifications-response.fixture';
import { mappedNotificationsSettings } from '@api/fixtures/notifications/notifications.fixture';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationApiService', () => {
  let service: NotificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationApiService,
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
    service = TestBed.inject(NotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
