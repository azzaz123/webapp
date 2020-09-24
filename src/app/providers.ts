import { Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
export const PROVIDERS: Provider[] = [
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
    deps: [CookieService]
  }
];

export function subdomainFactory(cookieService: CookieService) {
  const subdomain: string = cookieService.get('subdomain');
  return subdomain ? subdomain : 'www';
}
