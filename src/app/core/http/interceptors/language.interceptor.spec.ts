import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DeviceService } from '@core/device/device.service';
import { environment } from '@environments/environment';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';

import { LanguageInterceptor, LANGUAGE_HEADER_NAME } from './language.interceptor';

describe('LanguageInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LanguageInterceptor,
          multi: true,
        },
        DeviceService,
        DeviceDetectorService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  describe('when doing a request to wallapop monolith server', () => {
    describe('and when there is no language in the request', () => {
      it('should send to server all the available languages from the browser', () => {
        const expectedUrl = environment.baseUrl;
        const expectedLanguageHeaderValue = 'en,es;q=0.9';

        http.get(expectedUrl).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(req.request.headers.has(LANGUAGE_HEADER_NAME)).toBe(true);
        expect(req.request.headers.get(LANGUAGE_HEADER_NAME)).toEqual(expectedLanguageHeaderValue);
      });

      describe('and when the browser supports more than 10 languages', () => {
        const MOCK_BROWSER_LANGUAGES = ['vi', 'en_US', 'sk', 'sk', 'tr', 'de_CH', 'tr', 'az', 'vi', 'ge', 'ro'];
        const originalLanguages = [...navigator.languages];

        beforeEach(() => {
          Object.defineProperty(navigator, 'languages', {
            value: MOCK_BROWSER_LANGUAGES,
            writable: true,
          });
        });

        afterAll(() => {
          Object.defineProperty(navigator, 'languages', {
            value: originalLanguages,
            writable: true,
          });
        });

        it('should send to server all the available languages from the browser with minimum quality values', () => {
          const expectedUrl = environment.baseUrl;
          const expectedLanguageHeaderValue =
            'en,vi;q=0.9,en_US;q=0.8,sk;q=0.7,sk;q=0.6,tr;q=0.5,de_CH;q=0.4,tr;q=0.3,az;q=0.2,vi;q=0.1,ge;q=0.1,ro;q=0.1';

          http.get(expectedUrl).subscribe();
          const req: TestRequest = httpMock.expectOne(expectedUrl);
          req.flush({});

          expect(req.request.headers.has(LANGUAGE_HEADER_NAME)).toBe(true);
          expect(req.request.headers.get(LANGUAGE_HEADER_NAME)).toEqual(expectedLanguageHeaderValue);
        });
      });
    });

    describe('and when the language was specified in the request', () => {
      it('should send the language that was specified', () => {
        const expectedUrl = environment.baseUrl;
        const expectedLanguageHeaderValue = 'cat, en;q=0.9, es;q=0.85';

        http.get(expectedUrl, { headers: { [LANGUAGE_HEADER_NAME]: expectedLanguageHeaderValue } }).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(req.request.headers.has(LANGUAGE_HEADER_NAME)).toBe(true);
        expect(req.request.headers.get(LANGUAGE_HEADER_NAME)).toEqual(expectedLanguageHeaderValue);
      });
    });
  });

  describe('when doing a request to another server other than wallapop monolith', () => {
    it('should not send any language to the server', () => {
      const expectedUrl = environment.remoteConsoleUrl;

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.headers.has(LANGUAGE_HEADER_NAME)).toBe(false);
    });

    describe('and when the language was specified in the request', () => {
      it('should send the language that was specified', () => {
        const expectedUrl = environment.remoteConsoleUrl;
        const expectedLanguageHeaderValue = 'cat, en;q=0.9, es;q=0.85';

        http.get(expectedUrl, { headers: { [LANGUAGE_HEADER_NAME]: expectedLanguageHeaderValue } }).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(req.request.headers.has(LANGUAGE_HEADER_NAME)).toBe(true);
        expect(req.request.headers.get(LANGUAGE_HEADER_NAME)).toEqual(expectedLanguageHeaderValue);
      });
    });
  });
});
