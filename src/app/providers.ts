import { APP_INITIALIZER, Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from './core/user/user.service';
import { User, PERMISSIONS } from './core/user/user';
export const PROVIDERS: Provider[] = [
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
    deps: [CookieService]
  },
  {
    provide: APP_INITIALIZER,
    useFactory: permissionFactory,
    deps: [UserService, NgxPermissionsService],
    multi: true
  }
];

export function subdomainFactory(cookieService: CookieService) {
  const subdomain: string = cookieService.get('subdomain');
  return subdomain ? subdomain : 'www';
}

export function permissionFactory(userService: UserService, permissionService: NgxPermissionsService) {
  return () => {
    return userService.me()
      .map((user: User) => {
        if (user) {
          userService.setPermission(user.type);
          userService.setSubscriptionsFeatureFlag().subscribe((isActive => {
            if (isActive) {
              permissionService.addPermission(PERMISSIONS.subscriptions);
            }
          }));
        }
        return user;
      })
      .toPromise();
  };
}
