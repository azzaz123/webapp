import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { HttpServiceNew } from '../http.service.new';
import { environment } from '../../../../environments/environment';
import { HttpModuleNew } from '../http.module.new';
import { AccessTokenService } from '../access-token.service';
import { TOKEN_AUTHORIZATION_HEADER_NAME } from './index';
import { TOKEN_TIMESTAMP_HEADER_NAME, TOKEN_SIGNATURE_HEADER_NAME, TokenInterceptor } from './token.interceptor';

const MOCK_TOKEN = 'token';
const MOCK_V3_ENDPOINT = 'api/v3/endpoint';

describe(`TokenInterceptor`, () => {
  let injector: TestBed;
  let httpService: HttpServiceNew;
  let httpMock: HttpTestingController;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule, HttpModuleNew]
    });

    httpService = injector.get(HttpServiceNew);
    httpMock = injector.get(HttpTestingController);
    accessTokenService = injector.get(AccessTokenService);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  it('should not add authorization header if no token exists', () => {
    accessTokenService.deleteAccessToken();

    httpService.get('').subscribe(response => expect(response).toEqual({}));
    httpMock.expectNone(environment.baseUrl);
  });

  it('should add authorization header if token exists', () => {
    accessTokenService.storeAccessToken(MOCK_TOKEN);

    httpService.get('').subscribe();
    const req: TestRequest = httpMock.expectOne(environment.baseUrl);
    req.flush({});

    const authHeaderValue = req.request.headers.get(TOKEN_AUTHORIZATION_HEADER_NAME);
    expect(authHeaderValue).toBeTruthy();
    expect(authHeaderValue).toBe('Bearer ' + MOCK_TOKEN);
  });

  it('should not add authorization headers for v3 urls if no token exists', () => {
    accessTokenService.deleteAccessToken();

    httpService.get(MOCK_V3_ENDPOINT).subscribe(response => expect(response).toEqual({}));
    httpMock.expectNone(environment.baseUrl + MOCK_V3_ENDPOINT);
  });

  it('should add authorization headers for v3 urls if token exists', () => {
    accessTokenService.storeAccessToken(MOCK_TOKEN);

    httpService.get(MOCK_V3_ENDPOINT).subscribe();
    const req: TestRequest = httpMock.expectOne(environment.baseUrl + MOCK_V3_ENDPOINT);
    req.flush({});

    expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(true);
    expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(true);
  });

  it('should return empty response if user is NOT logged in', () => {
    accessTokenService.storeAccessToken(null);

    httpService.get(MOCK_V3_ENDPOINT).subscribe(response => expect(response).toEqual({}));
    httpMock.expectNone(environment.baseUrl + MOCK_V3_ENDPOINT);
  });
});
