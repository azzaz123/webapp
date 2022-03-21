import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { of } from 'rxjs';
import { PaymentsClientBrowserInfoHttpService } from './http/payments-client-browser-info-http.service';

import { PaymentsClientBrowserInfoApiService } from './payments-client-browser-info-api.service';

describe('PaymentsClientBrowserInfoApiService', () => {
  let service: PaymentsClientBrowserInfoApiService;
  let paymentsClientBrowserInfoHttpService: PaymentsClientBrowserInfoHttpService;

  const MOCK_WINDOW_NAVIGATOR: Partial<Navigator> = {
    javaEnabled: () => false,
    language: 'ca',
    userAgent: 'Internet Explorer 7',
  };

  const MOCK_WINDOW_SCREEN: Partial<Screen> = {
    width: 288,
    height: 1337,
    colorDepth: 32,
  };

  const MOCK_WINDOW_PROPERTIES: Partial<Window> = {
    navigator: MOCK_WINDOW_NAVIGATOR as Navigator,
    screen: MOCK_WINDOW_SCREEN as Screen,
  };

  const MOCK_TIMEZONE_OFFSET: string = '+120';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WINDOW_TOKEN,
          useValue: MOCK_WINDOW_PROPERTIES,
        },
        { provide: PaymentsClientBrowserInfoHttpService, useValue: { put: () => of(true) } },
      ],
    });
    service = TestBed.inject(PaymentsClientBrowserInfoApiService);
    paymentsClientBrowserInfoHttpService = TestBed.inject(PaymentsClientBrowserInfoHttpService);

    spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(MOCK_TIMEZONE_OFFSET);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when sending client info to server', () => {
    beforeEach(fakeAsync(() => {
      spyOn(paymentsClientBrowserInfoHttpService, 'put');

      service.sendBrowserInfo();
      tick();
    }));

    it('should ask to send client info', () => {
      expect(paymentsClientBrowserInfoHttpService.put).toHaveBeenCalledTimes(1);
    });

    it('should send valid browser data', () => {
      const expectedWindowData: PaymentsClientBrowserInfo = {
        acceptHeader: 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
        colorDepth: MOCK_WINDOW_SCREEN.colorDepth,
        isJavaEnabled: MOCK_WINDOW_NAVIGATOR.javaEnabled(),
        isJavaScriptEnabled: true,
        language: MOCK_WINDOW_NAVIGATOR.language,
        screenHeight: MOCK_WINDOW_SCREEN.height,
        screenWidth: MOCK_WINDOW_SCREEN.width,
        timeZoneOffset: MOCK_TIMEZONE_OFFSET,
        userAgent: MOCK_WINDOW_NAVIGATOR.userAgent,
      };

      expect(paymentsClientBrowserInfoHttpService.put).toHaveBeenCalledWith(expectedWindowData);
    });
  });
});
