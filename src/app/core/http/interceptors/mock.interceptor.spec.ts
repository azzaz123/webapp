import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpServiceNew } from '../http.service.new';
import { environment } from '../../../../environments/environment';
import { HttpModuleNew } from '../http.module.new';
import { MockInterceptor } from './mock.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe(`MockInterceptor`, () => {
  let injector: TestBed;
  let httpService: HttpServiceNew;
  let httpMock: HttpTestingController;
  let interceptor: MockInterceptor;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [ HttpClientTestingModule, HttpModuleNew ]
    });

    httpService = injector.get(HttpServiceNew);
    httpMock = injector.get(HttpTestingController);
    interceptor = injector.get(HTTP_INTERCEPTORS).filter(inter => inter instanceof MockInterceptor)[0];

  });

  afterEach((): void => {
    httpMock.verify();
  });

  it('should NOT perform real http request when url is mocked ', () => {
    interceptor.mockUrls = [
      {
        url: environment.baseUrl,
        data: {}
      }
    ];

    httpService.get('').subscribe();

    httpMock.expectNone(environment.baseUrl);
  });

  it('should return mocked data when URL and data is specified', () => {
    let dataResponse;
    const mockData = { param1: 'value1' };
    interceptor.mockUrls = [
      {
        url: environment.baseUrl,
        data: mockData
      }
    ];

    httpService.get('').subscribe(response => dataResponse = response);

    expect(dataResponse).toEqual(mockData);
  });
});
