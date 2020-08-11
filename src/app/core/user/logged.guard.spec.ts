import { TestBed } from '@angular/core/testing';
import { LoggedGuard, REDIRECT_SECRET } from './logged.guard';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { CookieService } from 'ngx-cookie';
import * as CryptoJS from 'crypto-js';

describe('LoggedGuard', (): void => {
  let loggedGuard: LoggedGuard;
  let accessTokenService: AccessTokenService;
  const mockCurrentUrl = 'https://web.wallapop.com/chat';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedGuard,
        AccessTokenService,
        {
          provide: CookieService, useValue: {
            put(value) {
            },
            remove() {
            },
            get() {
            }
          }
        }
      ]
    });
    loggedGuard = TestBed.inject(LoggedGuard);
    accessTokenService = TestBed.inject(AccessTokenService);
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {
    describe('when no access token', () => {
      it('should return false and redirect to SEO web with pending redirect', () => {
        const decriptAux =
          (toDecrypt: string) => CryptoJS.AES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoJS.enc.Utf8);
        const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
        const expectedRedirectQueryParam = mockCurrentUrl;

        const result = loggedGuard.canActivate();
        const resultRedirectQueryParam = window.location.href.split('?')[1].replace('redirectUrl=', '');

        expect(result).toEqual(false);
        expect(window.location.href.startsWith(expectedUrl)).toEqual(true);
        expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
      });
    });

    describe('when access token in cookies', () => {
      beforeEach(() => accessTokenService.storeAccessToken('abc'));

      it('should return true and NOT redirect to SEO web if access token', () => {
        const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

        const result = loggedGuard.canActivate();

        expect(result).toEqual(true);
        expect(window.location.href.startsWith(notExpectedUrl)).toEqual(false);
      });
    });

  });

  describe('canLoad', () => {
    describe('when no access token', () => {
      it('should return false and redirect to SEO web with pending redirect', () => {
        const decriptAux =
          (toDecrypt: string) => CryptoJS.AES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoJS.enc.Utf8);
        const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
        const expectedRedirectQueryParam = mockCurrentUrl;

        const result = loggedGuard.canActivate();
        const resultRedirectQueryParam = window.location.href.split('?')[1].replace('redirectUrl=', '');

        expect(result).toEqual(false);
        expect(window.location.href.startsWith(expectedUrl)).toEqual(true);
        expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
      });
    });

    describe('when access token in cookies', () => {
      beforeEach(() => accessTokenService.storeAccessToken('abc'));

      it('should return true and NOT redirect to SEO web if access token', () => {
        const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

        const result = loggedGuard.canActivate();

        expect(result).toEqual(true);
        expect(window.location.href.startsWith(notExpectedUrl)).toEqual(false);
      });
    });
  });
});
