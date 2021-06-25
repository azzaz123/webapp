import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AccessTokenService } from '@core/http/access-token.service';

export const AUTHORIZATION_HEADER_NAME = 'Authorization';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private accessTokenService: AccessTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const setHeaders: { [key: string]: string } = {};

    const isWallapopRequest = request.url.startsWith(environment.baseUrl);
    const isHeaderNotPresent = !request.headers.has(AUTHORIZATION_HEADER_NAME);
    const hasAccessToken = !!this.accessTokenService.accessToken;
    const validAccessToken = this.accessTokenService.accessToken === this.accessTokenService.accessTokenFromCookies;
    const canAddAuthorizationHeader = isWallapopRequest && hasAccessToken && isHeaderNotPresent;

    if (!validAccessToken) {
      window.location.reload();
    }

    if (canAddAuthorizationHeader) {
      setHeaders[AUTHORIZATION_HEADER_NAME] = `Bearer ${this.accessTokenService.accessToken}`;
    }

    request = request.clone({ setHeaders });
    return next.handle(request);
  }
}
