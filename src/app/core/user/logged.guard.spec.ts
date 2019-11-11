import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { environment } from '../../../environments/environment';
import { WindowRef } from '../window/window.service';
import { AccessTokenService } from '../http/access-token.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from './user.service';
import { User } from './user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
export const mockRouterStateSnapshot: RouterStateSnapshot = {
  url: 'test?foo=bar',
  root: mockActivatedRouteSnapshot
};

class MockWindow {
  public nativeWindow = {
    location: {
      href: ''
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
            }
          }
        },
        LoggedGuard,
        {
          provide: NgxPermissionsService,
          useValue: {
            getPermissions() { }
          }
        },
        {
          provide: UserService,
          useValue: {
            me(): Observable<User> {
              return Observable.of(MOCK_USER);
            },
            setPermission(userType: string): void { }
          },
        },
      ]
    });
    loggedGuard = TestBed.get(LoggedGuard);
    window = TestBed.get(WindowRef);
    accessTokenService = TestBed.get(AccessTokenService);
    accessTokenService.storeAccessToken(null);
    userService = TestBed.get(UserService);
    permissionService = TestBed.get(NgxPermissionsService);
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {

    const redirectUrl = encodeURIComponent(`${environment.baseUrl}${mockRouterStateSnapshot.url}`);

    beforeEach(() => {
      spyOn(permissionService, 'getPermissions').and.returnValue({});
      spyOn(userService, 'me').and.callThrough();
    });

    it('should return false and redirect if no access token', (): void => {
      const result = loggedGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

      expect(result).toBeFalsy();
      expect(window.nativeWindow.location.href).toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
    });

    it('should return true and NOT redirect if access token', () => {
      accessTokenService.storeAccessToken('abc');
      const result = loggedGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

      expect(result).toBeTruthy();
      expect(window.nativeWindow.location.href).not.toBe(`${environment.siteUrl}login?redirectUrl=${redirectUrl}`);
    });

    it('should check the current user permissions', () => {
      accessTokenService.storeAccessToken('abc');
      const result = loggedGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

      expect(permissionService.getPermissions).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should call userService.me and set the permissions for the user', () => {
      accessTokenService.storeAccessToken('abc');
      const result = loggedGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

      userService.me().map((u: User) => {
        expect(userService.setPermission).toHaveBeenCalledWith(u.type);
      });

      expect(userService.me).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
  });

  describe('generateUrlAsQueryParam', () => {
    it('should generate valid URI query param', () => {
      const expectedUrl = `${environment.baseUrl}${mockRouterStateSnapshot.url}`;

      const result =
        decodeURIComponent(loggedGuard.generateUrlAsQueryParam(mockRouterStateSnapshot.url));

      expect(result).toBe(expectedUrl);
    });
  });
});
