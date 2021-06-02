import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '@environments/environment';
import { MockInterceptor } from './mock.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe(`MockInterceptor`, () => {
  let injector: TestBed;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptor: MockInterceptor;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockInterceptor,
          multi: true,
        },
      ],
    });

    http = injector.inject(HttpClient);
    httpMock = injector.inject(HttpTestingController);
    interceptor = injector.inject(HTTP_INTERCEPTORS).filter((inter) => inter instanceof MockInterceptor)[0];
  });

  afterEach((): void => {
    httpMock.verify();
  });

  it('should NOT perform real http request when url is mocked ', () => {
    interceptor.mockUrls = [
      {
        url: environment.baseUrl,
        data: {},
      },
    ];

    http.get(environment.baseUrl).subscribe();

    httpMock.expectNone(environment.baseUrl);
  });

  it('should return mocked data when URL and data is specified', () => {
    let dataResponse;
    const mockData = { param1: 'value1' };
    interceptor.mockUrls = [
      {
        url: environment.baseUrl,
        data: mockData,
      },
    ];

    http.get(environment.baseUrl).subscribe((response) => (dataResponse = response));

    expect(dataResponse).toEqual(mockData);
  });
});
