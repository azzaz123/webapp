import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { environment } from 'environments/environment';
import { WindowRef } from 'shield';

class MockLoginService {
  public token: string;
}

class MockRouter {
  navigate(routes: string[]) {
  }
}

class MockCookieService {

  public array: any = {
    'accessToken': 'accessToken',
    'deviceAccessToken': 'deviceAccessToken'
  };

  public get(value: string) {
    return this.array[value];
  }

  public remove(value: string) {
    delete this.array[value];
  }
}

class MockWindow {
  public nativeWindow = {
    location: {
      href: ''
    }
  };
}

describe('LoggedGuard', (): void => {
  let cookieService: CookieService;
  let router: Router;
  let loggedGuard: LoggedGuard;
  let window: WindowRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: CookieService, useClass: MockCookieService},
        {provide: WindowRef, useClass: MockWindow},
        {provide: Router, useClass: MockRouter},
        LoggedGuard
      ]
    });

    cookieService = TestBed.get(CookieService);
    router = TestBed.get(Router);
    loggedGuard = TestBed.get(LoggedGuard);
    window = TestBed.get(WindowRef);
  });

  it('should create an instance', (): void => {
    expect(loggedGuard).toBeTruthy();
  });

  describe('canActivate', (): void => {
    it('should call initApp and router.navigate', (): void => {
      // spyOn(router, 'navigate').and.callThrough();

      const result = loggedGuard.canActivate();

      expect(result).toBeFalsy();
      // TODO: check if token has been set in HtppService.
      // expect(router.navigate).toHaveBeenCalledWith(['/overview']); -> TODO: set the correct navigation route.
    });


    it('shouldn\'t call any param and return true', (): void => {
      spyOn(router, 'navigate').and.callThrough();

      (cookieService as any).array = {};

      const result = loggedGuard.canActivate();

      expect(result).toBeTruthy();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(window.nativeWindow.location.href).toBe(environment.loginUrl);
    })
  })
});
