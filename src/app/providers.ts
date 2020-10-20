import { Provider, APP_INITIALIZER } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserService } from './core/user/user.service';
import { NgxPermissionsService } from 'ngx-permissions';

export const PROVIDERS: Provider[] = [
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
    deps: [CookieService]
  },
  {
    provide: APP_INITIALIZER,
    useFactory: userPermissionsFactory,
    deps: [UserService, NgxPermissionsService],
    multi: true
  }
];

export function subdomainFactory(cookieService: CookieService) {
  const subdomain: string = cookieService.get('subdomain');
  return subdomain ? subdomain : 'www';
}

export function userPermissionsFactory(userService: UserService): () => Promise<boolean> {
  return () => userService.checkUserPermissions().toPromise();
}
