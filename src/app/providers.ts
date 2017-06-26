import { Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AccessTokenService } from 'shield';
import { AccessTokenService as CustomAccessTokenService } from './core/user/access-token.service';

export const PROVIDERS: Provider[] = [
  {
    provide:    AccessTokenService,
    useFactory: httpFactory,
    deps:       [CookieService]
  }
];


export function httpFactory(cookieService: CookieService) {
  return new CustomAccessTokenService(cookieService);
}
