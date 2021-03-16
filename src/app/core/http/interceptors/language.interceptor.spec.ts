import { TestBed } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieModule, CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';

import { LanguageInterceptor } from './language.interceptor';

describe('LanguageInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        LanguageInterceptor,
        DeviceService,
        DeviceDetectorService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    })
  );

  it('should be created', () => {
    const interceptor: LanguageInterceptor = TestBed.inject(LanguageInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
