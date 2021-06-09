import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

import { environment } from '@environments/environment';

import { NullQueryParamsInterceptor } from './null-query-params.interceptor';

describe(`NullQueryParamsInterceptor`, () => {
  let injector: TestBed;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NullQueryParamsInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = injector.get(HttpClient);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  describe('when doing a request to the backend with query params and some of them are null', () => {
    it('should remove only the null params', () => {
      const expectedParams = 'param1=asap&param2=123&param3=0';
      const expectedUrl = `${environment.baseUrl}?${expectedParams}`;

      httpClient
        .get(environment.baseUrl, {
          params: {
            param1: 'asap',
            param2: 123,
            param3: 0,
            param4: null,
          } as any,
        })
        .subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.params.has('param1')).toEqual(true);
      expect(req.request.params.has('param2')).toEqual(true);
      expect(req.request.params.has('param3')).toEqual(true);
      expect(req.request.params.has('param4')).toEqual(false);
    });
  });

  describe('when doing a request to the backend with non null params', () => {
    it('should not modify them', () => {
      const expectedParams = 'param1=asap&param2=123&param3=bruh';
      const expectedUrl = `${environment.baseUrl}?${expectedParams}`;

      httpClient
        .get(environment.baseUrl, {
          params: { param1: 'asap', param2: 123, param3: 'bruh' } as any,
        })
        .subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.params.has('param1')).toEqual(true);
      expect(req.request.params.has('param2')).toEqual(true);
      expect(req.request.params.has('param3')).toEqual(true);
    });
  });
});
