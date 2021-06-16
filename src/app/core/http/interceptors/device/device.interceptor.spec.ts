import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

import { API_V3, DeviceInterceptor, DEVICE_HEADER_NAME_API_V1, DEVICE_HEADER_NAME_API_V3, DEVICE_OS } from './device.interceptor';

describe('DeviceInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DeviceInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  describe('when doing a request to wallapop server', () => {
    describe('and the request is to the api v3', () => {
      it('should add the new device header and the old one', () => {
        const expectedUrl = `${environment.baseUrl}${API_V3}random`;
        const expectedHeaderValue = DEVICE_OS.WEB.toString();

        http.get(expectedUrl).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V1)).toBe(true);
        expect(req.request.headers.get(DEVICE_HEADER_NAME_API_V1)).toEqual(expectedHeaderValue);
        expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V3)).toBe(true);
        expect(req.request.headers.get(DEVICE_HEADER_NAME_API_V3)).toEqual(expectedHeaderValue);
      });
    });

    describe('and the request is NOT to the api v3', () => {
      it('should add only the old device header', () => {
        const expectedUrl = `${environment.baseUrl}shnm-portlet/api/v1/random`;
        const expectedHeaderValue = DEVICE_OS.WEB.toString();

        http.get(expectedUrl).subscribe();
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush({});

        expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V1)).toBe(true);
        expect(req.request.headers.get(DEVICE_HEADER_NAME_API_V1)).toEqual(expectedHeaderValue);
        expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V3)).toBe(false);
      });
    });
  });

  describe('when doing a request to a server that is not the wallapop one', () => {
    it('should not add the device header', () => {
      const expectedUrl = `https://google.com/`;

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V1)).toBe(false);
      expect(req.request.headers.get(DEVICE_HEADER_NAME_API_V1)).toEqual(null);
      expect(req.request.headers.has(DEVICE_HEADER_NAME_API_V3)).toBe(false);
      expect(req.request.headers.get(DEVICE_HEADER_NAME_API_V3)).toEqual(null);
    });
  });
});
