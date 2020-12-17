import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AccessTokenService } from '../access-token.service';
import { environment } from '../../../../environments/environment';
import { LOGIN_ENDPOINT } from '@public/features/login/core/services/login.service';

export const TOKEN_AUTHORIZATION_HEADER_NAME = 'Authorization';
export const TOKEN_TIMESTAMP_HEADER_NAME = 'Timestamp';
export const TOKEN_SIGNATURE_HEADER_NAME = 'X-Signature';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private accessTokenService: AccessTokenService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith('.svg')) {
      return next.handle(request);
    }
    {
      const setHeaders: any = {};

      if (
        !request.headers.has(TOKEN_AUTHORIZATION_HEADER_NAME) &&
        !!this.accessTokenService.accessToken
      ) {
        setHeaders[
          TOKEN_AUTHORIZATION_HEADER_NAME
        ] = `Bearer ${this.accessTokenService.accessToken}`;
      }

      if (request.url.indexOf('v3') !== -1) {
        const timestamp = new Date().getTime();
        const endpoint = request.url.replace(environment.baseUrl, '');
        setHeaders[TOKEN_TIMESTAMP_HEADER_NAME] = timestamp.toString();
        setHeaders[
          TOKEN_SIGNATURE_HEADER_NAME
        ] = this.accessTokenService.getTokenSignature(
          endpoint,
          request.method,
          timestamp
        );
      }
      request = request.clone({ setHeaders });
      return next.handle(request);
    }
  }
}
