import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

import { DeviceInterceptor, DEVICE_HEADER_NAME, DEVICE_OS } from './device.interceptor';

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

  describe('when doing a request to wallapop monolith server', () => {
    it('should add the device header', () => {
      const expectedUrl = environment.baseUrl;
      const expectedHeaderValue = DEVICE_OS.WEB.toString();

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.headers.has(DEVICE_HEADER_NAME)).toBe(true);
      expect(req.request.headers.get(DEVICE_HEADER_NAME)).toEqual(expectedHeaderValue);
    });
  });

  describe('when doing a request to a server that is not the wallapop monolith one', () => {
    it('should not add the device header', () => {
      const expectedUrl = `https://google.com/`;

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.headers.has(DEVICE_HEADER_NAME)).toBe(false);
      expect(req.request.headers.get(DEVICE_HEADER_NAME)).toEqual(null);
    });
  });
});
