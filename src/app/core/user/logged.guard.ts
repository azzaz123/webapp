
import { CanActivate, CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WindowRef } from '../window/window.service';
import { AccessTokenService } from '../http/access-token.service';

@Injectable()
export class LoggedGuard implements CanActivate, CanLoad {

  constructor(private accessTokenService: AccessTokenService) { }

  public canActivate() {
    return this.loggedGuardLogic();
  }

  public canLoad() {
    return this.loggedGuardLogic();
  }

  private loggedGuardLogic(): boolean {
    if (!this.accessTokenService.accessToken) {
      const redirect = `${environment.siteUrl}login?redirectUrl=${encodeURIComponent(window.location.href)}`;
      window.location.href = redirect;
      return false;
    }
    return true;
  }
}

