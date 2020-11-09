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
import {
  TOKEN_TIMESTAMP_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
} from './token.interceptor';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LOGIN_ENDPOINT } from '../../user/user.service';

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
      imports: [HttpClientTestingModule, HttpModuleNew],
    });

    http = injector.get(HttpClient);
    httpMock = injector.get(HttpTestingController);
    accessTokenService = injector.get(AccessTokenService);
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
      expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(
        false
      );
      expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(
        false
      );
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
    });
  });

  describe('when the user does not have access token and URL is not login', () => {
    beforeEach(() => accessTokenService.deleteAccessToken());

    it('should not do http petition', () => {
      http.get(environment.baseUrl).subscribe();

      httpMock.expectNone(environment.baseUrl);
    });

    it('should return 401 and empty response', () => {
      let response;

      http
        .get<HttpResponse<Object>>(
          `${environment.baseUrl}${MOCK_V3_ENDPOINT}`,
          { observe: 'response' as 'body' }
        )
        .subscribe((r) => (response = r));

      expect(response.status).toEqual(401);
      expect(response.statusText).toEqual('Unauthorized');
      expect(response.body).toEqual({});
      httpMock.expectNone(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`);
    });
  });

  describe('when the user does not have access token but request is to login endpoint', () => {
    it('should not add authorization header', () => {
      accessTokenService.storeAccessToken(MOCK_TOKEN);
      const expectedUrl = `${environment.baseUrl}${LOGIN_ENDPOINT}`;

      http.get(expectedUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      const authHeaderValue = req.request.headers.get(
        TOKEN_AUTHORIZATION_HEADER_NAME
      );
      expect(authHeaderValue).toBeFalsy();
    });
  });

  describe('when the user has access token', () => {
    it('should add authorization header', () => {
      accessTokenService.storeAccessToken(MOCK_TOKEN);

      http.get(environment.baseUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(environment.baseUrl);
      req.flush({});

      const authHeaderValue = req.request.headers.get(
        TOKEN_AUTHORIZATION_HEADER_NAME
      );
      expect(authHeaderValue).toBeTruthy();
      expect(authHeaderValue).toBe(`Bearer ${MOCK_TOKEN}`);
    });

    it('should add authorization headers for v3 urls', () => {
      accessTokenService.storeAccessToken(MOCK_TOKEN);

      http.get(`${environment.baseUrl}${MOCK_V3_ENDPOINT}`).subscribe();
      const req: TestRequest = httpMock.expectOne(
        `${environment.baseUrl}${MOCK_V3_ENDPOINT}`
      );
      req.flush({});

      expect(req.request.headers.has(TOKEN_TIMESTAMP_HEADER_NAME)).toEqual(
        true
      );
      expect(req.request.headers.has(TOKEN_SIGNATURE_HEADER_NAME)).toEqual(
        true
      );
    });
  });
});
