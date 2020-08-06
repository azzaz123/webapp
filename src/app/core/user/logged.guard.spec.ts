import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { CookieService } from 'ngx-cookie';

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
            get () {
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

  describe('canActivate', () => {
    const redirectUrl = encodeURIComponent(window.location.href);

    describe('when there is no access token in cookies', () => {
      beforeEach(() => accessTokenService.deleteAccessToken());

      it('should return false and redirect', () => {
        let result: boolean;

        result = loggedGuard.canActivate();

        expect(result).toBeFalsy();
        expect(window.location.href).toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
      });
    });

    describe('when there is access token in cookies', () => {
      beforeEach(() => accessTokenService.storeAccessToken('mockToken'));

      it('should return true and do NOT redirect if access token', () => {
        let result: boolean;

        result = loggedGuard.canActivate();

        expect(result).toBeTruthy();
        expect(window.location.href).not.toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
      });
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
