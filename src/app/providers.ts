import { Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AccessTokenService } from './core/http/access-token.service';
import { HttpService } from './core/http/http.service';
import { RequestOptions, XHRBackend } from '@angular/http';

export const PROVIDERS: Provider[] = [
  {
    provide: 'SUBDOMAIN',
    useFactory: subdomainFactory,
    deps: [CookieService]
  },
  {
    provide: HttpService,
    useFactory: httpFactory,
    deps: [XHRBackend, RequestOptions, AccessTokenService]
  }
];

export function subdomainFactory(cookieService: CookieService) {
  const subdomain: string = cookieService.get('subdomain');
  return subdomain ? subdomain : 'www';
}

export function httpFactory(backend: XHRBackend,
                            defaultOptions: RequestOptions,
                            accessTokenService: AccessTokenService) {
  return new HttpService(backend, defaultOptions, accessTokenService);
}
