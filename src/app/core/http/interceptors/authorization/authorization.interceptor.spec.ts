import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { environment } from '@environments/environment';
import { LOGIN_ENDPOINT } from '@public/features/login/core/services/login.service';
import { CookieModule } from 'ngx-cookie';

import { AuthorizationInterceptor, AUTHORIZATION_HEADER_NAME } from './authorization.interceptor';

describe(`AuthorizationInterceptor`, () => {
  let injector: TestBed;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let accessTokenService: AccessTokenService;
  let targetUrl: string;

  const token = 'tokensito';
  const expectedAuthorizationHeaderValue = `Bearer ${token}`;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationInterceptor,
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

  describe('when the request is against the Wallapop server', () => {
    beforeEach(() => (targetUrl = `${environment.baseUrl}${LOGIN_ENDPOINT}`));

    describe('and when the user has access token', () => {
      beforeEach(() => jest.spyOn(accessTokenService, 'accessToken', 'get').mockReturnValue(token));

      describe('and when the request does NOT have an authorization header', () => {
        it('should add the authorization header', () => {
          http.get(targetUrl).subscribe();
          const req: TestRequest = httpMock.expectOne(targetUrl);
          req.flush({});

          const authorizationHeaderValue = req.request.headers.get(AUTHORIZATION_HEADER_NAME);
          expect(authorizationHeaderValue).toBe(expectedAuthorizationHeaderValue);
        });
      });

      describe('and when the request has an authorization header', () => {
        it('should NOT modify the authorization header', () => {
          const originalHeaderValue = `Mock bearer value`;
          const headers = {
            [AUTHORIZATION_HEADER_NAME]: originalHeaderValue,
          };

          http.get(targetUrl, { headers }).subscribe();
          const req: TestRequest = httpMock.expectOne(targetUrl);
          req.flush({});

          const authorizationHeaderValue = req.request.headers.get(AUTHORIZATION_HEADER_NAME);
          expect(authorizationHeaderValue).not.toBe(expectedAuthorizationHeaderValue);
          expect(authorizationHeaderValue).toBe(originalHeaderValue);
        });
      });
    });

    describe('and when the user does NOT have access token', () => {
      beforeEach(() => jest.spyOn(accessTokenService, 'accessToken', 'get').mockReturnValue(null));

      it('should NOT add the authorization header', () => {
        http.get(targetUrl).subscribe();
        const req: TestRequest = httpMock.expectOne(targetUrl);
        req.flush({});

        const authorizationHeaderValue = req.request.headers.get(AUTHORIZATION_HEADER_NAME);
        expect(authorizationHeaderValue).toBeFalsy();
      });
    });
  });

  describe('when the request is NOT against the Wallapop server', () => {
    beforeEach(() => (targetUrl = 'https://api.chucknorris.io/jokes/random'));

    it('should NOT add the authorization header', () => {
      http.get(targetUrl).subscribe();
      const req: TestRequest = httpMock.expectOne(targetUrl);
      req.flush({});

      const authorizationHeaderValue = req.request.headers.get(AUTHORIZATION_HEADER_NAME);
      expect(authorizationHeaderValue).toBeFalsy();
    });
  });
});
