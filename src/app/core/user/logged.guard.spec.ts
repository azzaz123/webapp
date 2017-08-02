import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { environment } from 'environments/environment';
import { AccessTokenService, WindowRef } from 'shield';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: WindowRef, useClass: MockWindow},
        {
          provide: AccessTokenService, useValue: {
          accessToken: null,
          storeAccessToken(value) {
            this.accessToken = value;
          }
        }
        },
        LoggedGuard
      ]
    });
    loggedGuard = TestBed.get(LoggedGuard);
    window = TestBed.get(WindowRef);
    accessTokenService = TestBed.get(AccessTokenService);
    accessTokenService.storeAccessToken(null);
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {
    it('should return false and redirect if no access token', (): void => {
      const result: boolean = loggedGuard.canActivate();
      expect(result).toBeFalsy();
      expect(window.nativeWindow.location.href).toBe(environment.siteUrl + 'login');
    });
    it('should return true and NOT redirect if access token', () => {
      accessTokenService.storeAccessToken('abc');
      const result: boolean = loggedGuard.canActivate();
      expect(result).toBeTruthy();
      expect(window.nativeWindow.location.href).not.toBe(environment.siteUrl + 'login');
    });
  })
});
