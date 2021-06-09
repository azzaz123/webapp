import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { environment } from '@environments/environment';
import {
  TOKEN_TIMESTAMP_HEADER_NAME,
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TokenInterceptor,
} from './token.interceptor';
import { HttpClient, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOGIN_ENDPOINT } from '@public/features/login/core/services/login.service';
import { CookieModule } from 'ngx-cookie';
import { AccessTokenService } from '@core/http/access-token.service';

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
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    http = injector.inject(HttpClient);
    httpMock = injector.inject(HttpTestingController);
    accessTokenService = injector.inject(AccessTokenService);
  });

  afterEach((): void => {
    httpMock.verify();
  });

  describe('when the request is an icon', () => {
    it('should do nothing', () => {
      const iconName = 'icon.svg';
      const iconContent = '<svg></svg>';
      const expectedUrl = `${environment.baseUrl}${iconName}`;
      let result: string;
      let response;

      http
        .get<HttpResponse<string>>(expectedUrl, {
          observe: 'response' as 'body',
        })
        .subscribe((r) => {
          result = r.body;
          response = r;
        });
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(iconContent);

      expect(result).toEqual(iconContent);
      expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(false);
      expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(false);
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
    });
  });

  describe('when the user does not have access token', () => {
    it('should not add authorization header', () => {
      const expectedUrl = `${environment.baseUrl}${LOGIN_ENDPOINT}`;

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      const authHeaderValue = req.request.headers.get(TOKEN_AUTHORIZATION_HEADER_NAME);
      expect(authHeaderValue).toBeFalsy();
    });
  });

  describe('when the user has access token', () => {
    it('should add authorization header', () => {
      accessTokenService.storeAccessToken(MOCK_TOKEN);

      http.get(environment.baseUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(environment.baseUrl);
      req.flush({});

      const authHeaderValue = req.request.headers.get(TOKEN_AUTHORIZATION_HEADER_NAME);
      expect(authHeaderValue).toBeTruthy();
      expect(authHeaderValue).toBe(`Bearer ${MOCK_TOKEN}`);
    });

    it('should add authorization headers for v3 urls', () => {
      accessTokenService.storeAccessToken(MOCK_TOKEN);

      http.get(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`).subscribe();
      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`);
      req.flush({});

      expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(true);
      expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(true);
    });
  });
});
