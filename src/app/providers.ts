import { InjectionToken, Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AccessTokenService, ConversationService, UserService, ItemService, EventService } from 'shield';
import { AccessTokenService as CustomAccessTokenService } from './core/user/access-token.service';
import { ItemService as CustomItemService } from './core/item/item.service';
import { ConversationService as CustomConversationService } from './core/conversation/conversation.service';
import { UserService as CustomUserService } from './core/user/user.service';
import { EventService as CustomEventService } from './core/event/event.service';

export const PROVIDERS: Provider[] = [
  {
    provide: AccessTokenService,
    useFactory: httpFactory,
    deps: [CookieService]
  },
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
    deps: [CookieService]
  },
  {
    provide: UserService,
    useExisting: CustomUserService
  },
  {
    provide: ItemService,
    useExisting: CustomItemService
  },
  {
    provide: ConversationService,
    useExisting: CustomConversationService
  },
  {
    provide: EventService,
    useExisting: CustomEventService
  }
];


export function httpFactory(cookieService: CookieService) {
  return new CustomAccessTokenService(cookieService);
}

export function subdomainFactory(cookieService: CookieService) {
  const subdomain: string = cookieService.get('subdomain');
  return subdomain ? subdomain : 'www';
}
