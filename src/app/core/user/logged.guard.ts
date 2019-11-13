import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import { WindowRef } from '../window/window.service';
import { UserService } from './user.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { User } from './user';
import { isEmpty } from 'lodash-es';

@Injectable()
export class LoggedGuard implements CanActivate {

  constructor(private accessTokenService: AccessTokenService,
    private window: WindowRef,
    private permissionService: NgxPermissionsService,
    private userService: UserService) {
  }

  public canActivate() {
    if (!this.accessTokenService.accessToken) {
      const redirect = `${environment.siteUrl}login?redirectUrl=${encodeURIComponent(window.location.href)}`;
      this.window.nativeWindow.location.href = redirect;
      return false;
    }
    if (isEmpty(this.permissionService.getPermissions())) {
      return this.userService.me().map((user: User) => {
        this.userService.setPermission(user.type);
        return true;
      });
    } else {
      return true;
    }
  }
}

