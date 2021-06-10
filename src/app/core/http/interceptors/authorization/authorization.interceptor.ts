import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AccessTokenService } from '@core/http/access-token.service';
import { AUTHORIZATION_HEADER_NAME } from '@core/http/interceptors';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private accessTokenService: AccessTokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let setHeaders: { [key: string]: string } = {};

    const isWallapopRequest = request.url.startsWith(environment.baseUrl);
    const isHeaderNotPresent = !request.headers.has(AUTHORIZATION_HEADER_NAME);
    const hasAccessToken = !!this.accessTokenService.accessToken;
    const canAddAuthorizationHeader = isWallapopRequest && hasAccessToken && isHeaderNotPresent;
    if (canAddAuthorizationHeader) {
      setHeaders[AUTHORIZATION_HEADER_NAME] = `Bearer ${this.accessTokenService.accessToken}`;
    }

    request = request.clone({ setHeaders });
    return next.handle(request);
  }
}
