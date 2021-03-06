import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { of } from 'rxjs';
import { PaymentsClientBrowserInfoHttpService } from './http/payments-client-browser-info-http.service';

import {
  EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX,
  EXTERNAL_PROVIDER_MODAL_HEIGHT_PX,
  EXTERNAL_PROVIDER_MODAL_LARGE_WIDTH_PROPORTION,
  PaymentsClientBrowserInfoApiService,
} from './payments-client-browser-info-api.service';

describe('PaymentsClientBrowserInfoApiService', () => {
  let service: PaymentsClientBrowserInfoApiService;
  let paymentsClientBrowserInfoHttpService: PaymentsClientBrowserInfoHttpService;
  let matchMediaReturnValue: boolean = true;

  const MOCK_WINDOW_NAVIGATOR: Partial<Navigator> = {
    javaEnabled: () => false,
    language: 'ca',
    userAgent: 'Internet Explorer 7',
  };

  const MOCK_WINDOW_INNER_WIDTH: number = 1337;
  const MOCK_WINDOW_INNER_HEIGHT: number = 728;

  const MOCK_WINDOW_SCREEN: Partial<Screen> = {
    colorDepth: 32,
  };

  const MOCK_WINDOW_MATCH_MEDIA = () => {
    return {
      matches: matchMediaReturnValue,
    } as MediaQueryList;
  };

  const MOCK_WINDOW_PROPERTIES: Partial<Window> = {
    innerWidth: MOCK_WINDOW_INNER_WIDTH,
    innerHeight: MOCK_WINDOW_INNER_HEIGHT,
    navigator: MOCK_WINDOW_NAVIGATOR as Navigator,
    screen: MOCK_WINDOW_SCREEN as Screen,
    matchMedia: MOCK_WINDOW_MATCH_MEDIA,
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

    describe('and when browser window size is NOT considered large', () => {
      beforeEach(() => (matchMediaReturnValue = false));

      it('should send valid browser data', () => {
        const expectedWindowData: PaymentsClientBrowserInfo = {
          colorDepth: MOCK_WINDOW_SCREEN.colorDepth,
          isJavaEnabled: MOCK_WINDOW_NAVIGATOR.javaEnabled(),
          isJavaScriptEnabled: true,
          language: MOCK_WINDOW_NAVIGATOR.language,
          modalWidth: MOCK_WINDOW_INNER_WIDTH,
          modalHeight: MOCK_WINDOW_INNER_HEIGHT - EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX,
          timeZoneOffset: MOCK_TIMEZONE_OFFSET,
          userAgent: MOCK_WINDOW_NAVIGATOR.userAgent,
        };

        expect(paymentsClientBrowserInfoHttpService.put).toHaveBeenCalledWith(expectedWindowData);
      });
    });

    describe('and when browser window size is considered large', () => {
      beforeEach(() => (matchMediaReturnValue = true));

      it('should send valid browser data', () => {
        const expectedWindowData: PaymentsClientBrowserInfo = {
          colorDepth: MOCK_WINDOW_SCREEN.colorDepth,
          isJavaEnabled: MOCK_WINDOW_NAVIGATOR.javaEnabled(),
          isJavaScriptEnabled: true,
          language: MOCK_WINDOW_NAVIGATOR.language,
          modalWidth: Math.round(MOCK_WINDOW_INNER_WIDTH * EXTERNAL_PROVIDER_MODAL_LARGE_WIDTH_PROPORTION),
          modalHeight: EXTERNAL_PROVIDER_MODAL_HEIGHT_PX - EXTERNAL_PROVIDER_MODAL_HEADER_HEIGHT_PX,
          timeZoneOffset: MOCK_TIMEZONE_OFFSET,
          userAgent: MOCK_WINDOW_NAVIGATOR.userAgent,
        };

        expect(paymentsClientBrowserInfoHttpService.put).toHaveBeenCalledWith(expectedWindowData);
      });
    });
  });
});
