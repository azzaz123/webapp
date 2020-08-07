
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { WindowRef } from '../window/window.service';
import { UserService } from './user.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { User, PERMISSIONS } from './user';
import { isEmpty } from 'lodash-es';
import * as CryptoJS from 'crypto-js';

export const REDIRECT_SECRET = 'redirectSecretBRUH';

@Injectable()
export class LoggedGuard implements CanActivate {

  constructor(private accessTokenService: AccessTokenService,
    private window: WindowRef,
    private permissionService: NgxPermissionsService,
    private userService: UserService) {
  }

  private generateOfuscatedRedirect(): string {
    const ofuscated = CryptoJS.AES.encrypt(this.window.nativeWindow.location.href, REDIRECT_SECRET).toString();
    const ofuscatedWithEncode = encodeURIComponent(ofuscated);
    return ofuscatedWithEncode;
  }

  public canActivate() {
    if (!this.accessTokenService.accessToken) {
      const redirect = `${environment.siteUrl}login?redirectUrl=${this.generateOfuscatedRedirect()}`;
      this.window.nativeWindow.location.href = redirect;
      return false;
    }
    if (isEmpty(this.permissionService.getPermissions())) {
      return this.userService.me().pipe(map((user: User) => {
        this.userService.setPermission(user);
        return true;
      }));
    } else {
      return true;
    }
  }
}

