import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { WindowRef } from '../window/window.service';

@Injectable()
export class LoggedGuard implements CanActivate {

  constructor(private accessTokenService: AccessTokenService,
              private window: WindowRef) {
  }

  public canActivate() {
    if (!this.accessTokenService.accessToken) {
      this.window.nativeWindow.location.href = environment.siteUrl + 'login';
      return false;
    }
    return true;
  }
}

