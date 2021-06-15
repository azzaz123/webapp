import { TestBed } from '@angular/core/testing';
import { LoggedGuard, REDIRECT_SECRET } from './logged.guard';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { CookieService } from 'ngx-cookie';
import * as CryptoEUTF8 from 'crypto-js/enc-utf8';
import * as CryptoJSAES from 'crypto-js/aes';

describe('LoggedGuard', (): void => {
  let loggedGuard: LoggedGuard;
  let accessTokenService: AccessTokenService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedGuard,
        AccessTokenService,
        {
          provide: CookieService,
          useValue: {
            put(value) {},
            remove() {},
            get() {},
          },
        },
      ],
    });
    loggedGuard = TestBed.inject(LoggedGuard);
    accessTokenService = TestBed.inject(AccessTokenService);
    cookieService = TestBed.inject(CookieService);

    window.location.href = 'https://web.wallapop.com';
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {
    describe('when the user is logged out', () => {
      it('should deny access and redirect to SEO web with pending redirect', () => {
        const decriptAux = (toDecrypt: string) => CryptoJSAES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoEUTF8);
        const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
        const expectedRedirectQueryParam = window.location.href;

        const result = loggedGuard.canActivate();
        const resultRedirectQueryParam = window.location.href.split('?')[1].replace('redirectUrl=', '');

        expect(result).toEqual(false);
        expect(window.location.href.startsWith(expectedUrl)).toEqual(true);
        expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
      });
    });

    describe('when access token in cookies', () => {
      beforeEach(() => spyOn(cookieService, 'get').and.returnValue('abc'));

      it('should allow access and NOT redirect to SEO web if access token', () => {
        const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

        const result = loggedGuard.canActivate();

        expect(result).toEqual(true);
        expect(window.location.href.startsWith(notExpectedUrl)).toEqual(false);
      });
    });
  });

  describe('canLoad', () => {
    describe('when the user is logged out', () => {
      it('should deny access and redirect to SEO web with pending redirect', () => {
        const decriptAux = (toDecrypt: string) => CryptoJSAES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoEUTF8);
        const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
        const expectedRedirectQueryParam = window.location.href;

        const result = loggedGuard.canActivate();
        const resultRedirectQueryParam = window.location.href.split('?')[1].replace('redirectUrl=', '');

        expect(result).toEqual(false);
        expect(window.location.href.startsWith(expectedUrl)).toEqual(true);
        expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
      });
    });

    describe('when access token in cookies', () => {
      beforeEach(() => spyOn(cookieService, 'get').and.returnValue('abc'));

      it('should allow access and NOT redirect to SEO web if access token', () => {
        console.log('hola', accessTokenService.accessToken);
        const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

        const result = loggedGuard.canActivate();

        expect(result).toEqual(true);
        expect(window.location.href.startsWith(notExpectedUrl)).toEqual(false);
      });
    });
  });
});
