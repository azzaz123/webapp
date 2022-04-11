import { TestBed } from '@angular/core/testing';

import { CommunicationsConsentApiService } from './communications-consent-api.service';
import { CommunicationsConsentGroup } from '@api/core/model/communications-consent';
import { of } from 'rxjs';
import {
  communicationsConsentIdToModify,
  communicationsConsentResponseFixture,
} from '@api/fixtures/comunications-consent/communications-consent-response.fixture';
import { mappedCommunicationsConsentGroup } from '@api/fixtures/comunications-consent/communications-consent-group.fixture';
import { CommunicationsConsentHttpService } from '@api/communications-consent/http/communications-consent-http.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommunicationsConsentApiService', () => {
  let service: CommunicationsConsentApiService;
  let httpService: CommunicationsConsentHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommunicationsConsentApiService,
        CommunicationsConsentHttpService,
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
    service = TestBed.inject(CommunicationsConsentApiService);
    httpService = TestBed.inject(CommunicationsConsentHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for notifications settings', () => {
    it('should retrieve notifications items', () => {
      let notificationsSettings: CommunicationsConsentGroup[];
      spyOn(httpService, 'getMyNotificationsSettings').and.returnValue(of(communicationsConsentResponseFixture));
      service.getCommunicationsConsentSettings().subscribe((data: CommunicationsConsentGroup[]) => (notificationsSettings = data));
      expect(notificationsSettings).toEqual(mappedCommunicationsConsentGroup);
    });

    it('should disable notification', (done) => {
      spyOn(httpService, 'setNotificationDisabled').and.returnValue(of(null));
      service.setConsentDisabled(`${communicationsConsentIdToModify}`).subscribe(() => {
        done();
      });
    });

    it('should enable notification', (done) => {
      spyOn(httpService, 'setNotificationEnable').and.returnValue(of(null));
      service.setConsentEnable(`${communicationsConsentIdToModify}`).subscribe(() => {
        done();
      });
    });
  });
});
