import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { communicationsConsentResponseFixture } from '@api/fixtures/notifications/communications-consent-response.fixture';
import { mappedCommunicationsConsentGroup } from '@api/fixtures/notifications/communications-consent-group.fixture';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { mapCommunicationsConsentGroup } from './communications-consent-mapper';

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
      const items = mapCommunicationsConsentGroup(communicationsConsentResponseFixture.notificationGroups, i18nService);
      expect(items).toEqual(mappedCommunicationsConsentGroup);
    });
  });
});
