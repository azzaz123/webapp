import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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

  public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.accessTokenService.accessToken) {
      const previousUrl = this.generateUrlAsQueryParam(state.url);
      const redirect = `${environment.siteUrl}login?redirectUrl=${previousUrl}`;
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

  public generateUrlAsQueryParam(endpoint: string) {
    const split = endpoint.split('?');
    const url = split[0].startsWith('/') ? `${environment.baseUrl}${split[0].substr(1)}` : `${environment.baseUrl}${split[0]}`;
    const params = split[1];

    return params ? encodeURIComponent(`${url}?${params}`) : encodeURIComponent(url);
  }
}

