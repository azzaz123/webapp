import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { HttpModuleNew } from '../http.module.new';
import { AccessTokenService } from '../access-token.service';
import { TOKEN_AUTHORIZATION_HEADER_NAME } from './index';
import { TOKEN_TIMESTAMP_HEADER_NAME, TOKEN_SIGNATURE_HEADER_NAME } from './token.interceptor';
import { HttpClient, HttpResponse } from '@angular/common/http';

const MOCK_TOKEN = 'token';
const MOCK_V3_ENDPOINT = 'api/v3/endpoint';

describe(`TokenInterceptor`, () => {
  let injector: TestBed;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule, HttpModuleNew]
    });

    http = injector.get(HttpClient);
    httpMock = injector.get(HttpTestingController);
    accessTokenService = injector.get(AccessTokenService);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  it('should not do http petition if user is not logged in', () => {
    accessTokenService.deleteAccessToken();

    http.get(environment.baseUrl).subscribe(response => expect(response).toEqual({}));
    httpMock.expectNone(environment.baseUrl);
  });

  it('should return 401 and empty response if user is NOT logged in', () => {
    accessTokenService.storeAccessToken(null);

    http.get<HttpResponse<Object>>(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`, { observe: 'response' as 'body' })
    .subscribe(response => {
      expect(response.status).toEqual(401);
      expect(response.statusText).toEqual('Unauthorized');
      expect(response.body).toEqual({});
    });
    httpMock.expectNone(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`);
  });

  it('should add authorization header if token exists', () => {
    accessTokenService.storeAccessToken(MOCK_TOKEN);

    http.get(environment.baseUrl).subscribe();
    const req: TestRequest = httpMock.expectOne(environment.baseUrl);
    req.flush({});

    const authHeaderValue = req.request.headers.get(TOKEN_AUTHORIZATION_HEADER_NAME);
    expect(authHeaderValue).toBeTruthy();
    expect(authHeaderValue).toBe(`Bearer ${MOCK_TOKEN}`);
  });

  it('should add authorization headers for v3 urls if token exists', () => {
    accessTokenService.storeAccessToken(MOCK_TOKEN);

    http.get(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`).subscribe();
    const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`);
    req.flush({});

    expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(true);
    expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(true);
  });
});
