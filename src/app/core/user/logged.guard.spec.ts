import { TestBed } from '@angular/core/testing';
import { LoggedGuard, REDIRECT_SECRET } from './logged.guard';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { CookieService } from 'ngx-cookie';
import * as CryptoJS from 'crypto-js';

const mockCurrentUrl = 'https://web.wallapop.com/chat';

describe('LoggedGuard', (): void => {

  let loggedGuard: LoggedGuard;
  let accessTokenService: AccessTokenService;

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
    it('should return false and redirect to SEO web with pending redirect when no access token', () => {
      const decriptAux =
        (toDecrypt: string) => CryptoJS.AES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoJS.enc.Utf8);
      const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
      const expectedRedirectQueryParam = mockCurrentUrl;

      const result = loggedGuard.canActivate();
      const resultRedirectQueryParam = window.location.href.split('?')[1].replace('redirectUrl=', '');

      expect(result).toEqual(false);
      expect(expectedUrl.startsWith(expectedUrl)).toEqual(true);
      expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
    });

    it('should return true and NOT redirect to SEO web if access token', () => {
      accessTokenService.storeAccessToken('abc');
      const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

      const result = loggedGuard.canActivate();

      expect(result).toBeTruthy();
      expect(window.location.href.startsWith(notExpectedUrl)).toEqual(false);
    });
  });

  describe('canLoad', () => {
    const redirectUrl = encodeURIComponent(window.location.href);

    describe('when there is no access token in cookies', () => {
      beforeEach(() => accessTokenService.deleteAccessToken());

      it('should return false and redirect', () => {
        let result: boolean;

        result = loggedGuard.canLoad();

        expect(result).toBeFalsy();
        expect(window.location.href).toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
      });
    });

    describe('when there is access token in cookies', () => {
      beforeEach(() => accessTokenService.storeAccessToken('mockToken'));

      it('should return true and do NOT redirect if access token', () => {
        let result: boolean;

        result = loggedGuard.canLoad();

        expect(result).toBeTruthy();
        expect(window.location.href).not.toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
      });
    });
  });
});
