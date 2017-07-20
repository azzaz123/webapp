import { Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AccessTokenService, UserService, ItemService } from 'shield';
import { AccessTokenService as CustomAccessTokenService } from './core/user/access-token.service';
import { UserService as CustomUserService } from './core/user/user.service';
import { ItemService as CustomItemService } from './core/item/item.service';

export const PROVIDERS: Provider[] = [
  {
    provide:    AccessTokenService,
    useFactory: httpFactory,
    deps:       [CookieService]
  },
  {
    provide:    UserService,
    useExisting: CustomUserService
  },
  {
    provide:    ItemService,
    useExisting: CustomItemService
  }
];


export function httpFactory(cookieService: CookieService) {
  return new CustomAccessTokenService(cookieService);
}
