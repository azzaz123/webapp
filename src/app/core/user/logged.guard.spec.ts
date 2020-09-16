
import {of as observableOf,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { LoggedGuard, REDIRECT_SECRET } from './logged.guard';
import { environment } from '../../../environments/environment';
import { WindowRef } from '../window/window.service';
import { AccessTokenService } from '../http/access-token.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from './user.service';
import { User, PERMISSIONS } from './user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import * as CryptoJS from 'crypto-js';

const mockCurrentUrl = 'https://web.wallapop.com/chat';

class MockWindow {
  public nativeWindow = {
    location: {
      href: mockCurrentUrl
    }
  };
}

describe('LoggedGuard', (): void => {

  let loggedGuard: LoggedGuard;
  let window: WindowRef;
  let accessTokenService: AccessTokenService;
  let permissionService: NgxPermissionsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WindowRef, useClass: MockWindow },
        {
          provide: AccessTokenService, useValue: {
            accessToken: null,
            storeAccessToken(value) {
              this.accessToken = value;
            },
            getTokenSignature() {
              return 'thesignature';
            }
          }
        },
        LoggedGuard,
        {
          provide: NgxPermissionsService,
          useValue: {
            getPermissions() { },
            addPermission() { }
          }
        },
        {
          provide: UserService,
          useValue: {
            me(): Observable<User> {
              return observableOf(MOCK_USER);
            },
            setPermission(userType: string): void { },
            setSubscriptionsFeatureFlag() {
              return observableOf(true);
            }
          },
        }
      ]
    });
    loggedGuard = TestBed.inject(LoggedGuard);
    window = TestBed.inject(WindowRef);
    accessTokenService = TestBed.inject(AccessTokenService);
    accessTokenService.storeAccessToken(null);
    userService = TestBed.inject(UserService);
    permissionService = TestBed.inject(NgxPermissionsService);
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {
    beforeEach(() => {
      spyOn(permissionService, 'getPermissions').and.returnValue({});
      spyOn(userService, 'me').and.callThrough();
    });

    it('should return false and redirect to SEO web with pending redirect when no access token', () => {
      const decriptAux =
        (toDecrypt: string) => CryptoJS.AES.decrypt(decodeURIComponent(toDecrypt), REDIRECT_SECRET).toString(CryptoJS.enc.Utf8);
      const expectedUrl = `${environment.siteUrl}login?redirectUrl=`;
      const expectedRedirectQueryParam = mockCurrentUrl;

      const result = loggedGuard.canActivate();
      const resultRedirectQueryParam = window.nativeWindow.location.href.split('?')[1].replace('redirectUrl=', '');

      expect(result).toEqual(false);
      expect(expectedUrl.startsWith(expectedUrl)).toEqual(true);
      expect(decriptAux(resultRedirectQueryParam)).toEqual(expectedRedirectQueryParam);
    });

    it('should return true and NOT redirect to SEO web if access token', () => {
      accessTokenService.storeAccessToken('abc');
      const notExpectedUrl = `${environment.siteUrl}login?redirectUrl=`;

      const result = loggedGuard.canActivate();

      expect(result).toBeTruthy();
      expect(window.nativeWindow.location.href.startsWith(notExpectedUrl)).toEqual(false);
    });

    it('should check the current user permissions', () => {
      accessTokenService.storeAccessToken('abc');
      const result = loggedGuard.canActivate();

      expect(permissionService.getPermissions).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should call userService.me and set the permissions for the user', () => {
      accessTokenService.storeAccessToken('abc');
      const result = loggedGuard.canActivate();

      userService.me().pipe(map((u: User) => {
        expect(userService.setPermission).toHaveBeenCalledWith(u.type);
      }));

      expect(userService.me).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
  });
});
