import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../../environments/environment';
import { WindowRef } from '../core/window/window.service';

@Injectable()
export class LoggedGuard implements CanActivate {
  constructor(private router: Router,
              private cookieService: CookieService,
              private window: WindowRef) {
  }

  public canActivate() {
    const accessToken: string = this.cookieService.get('accessToken');
    const deviceAccessToken: string = this.cookieService.get('deviceAccessToken');
    if (accessToken && deviceAccessToken) {
      // TODO: set token in HttpService
      // this.router.navigate(['/']); -> TODO: Redirect to chat / profile and add test.
      return false;
    } else {
      this.window.nativeWindow.location.href = environment.loginUrl;
    }
    return true;
  }
}

