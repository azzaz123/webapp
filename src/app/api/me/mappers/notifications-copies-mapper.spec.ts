import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { notificationsSettingsResponseFixture } from '@api/fixtures/me/notifications/notifications-response.fixture';
import { mappedNotificationsSettingsDto } from '@api/fixtures/me/notifications/notifications.fixture';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { BackendNotificationKeys, mapNotificationsSettings } from './notifications-copies-mapper';

describe('NotificationsSettingsMapper', () => {
  let i18nService: I18nService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {
            provide: I18nService,
            useValue: {
              translate: (key: TRANSLATION_KEY) => {
                return key;
              },
            },
          },
        ],
        declarations: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    i18nService = TestBed.inject(I18nService);
  });

  describe('mapNotificationSettings', () => {
    it('should map', () => {
      const items = mapNotificationsSettings(notificationsSettingsResponseFixture.notificationGroups, i18nService);

      expect(items).toEqual(mappedNotificationsSettingsDto);
    });
  });
});
