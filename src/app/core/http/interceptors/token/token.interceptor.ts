import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccessTokenService } from '@core/http/access-token.service';
import { environment } from '@environments/environment';

export const TOKEN_TIMESTAMP_HEADER_NAME = 'Timestamp';
export const TOKEN_SIGNATURE_HEADER_NAME = 'X-Signature';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private accessTokenService: AccessTokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.endsWith('.svg')) {
      return next.handle(request);
    }
    {
      const setHeaders: any = {};
      if (request.url.indexOf('v3') !== -1) {
        const timestamp = new Date().getTime();
        const endpoint = request.url.replace(environment.baseUrl, '');
        setHeaders[TOKEN_TIMESTAMP_HEADER_NAME] = timestamp.toString();
        setHeaders[TOKEN_SIGNATURE_HEADER_NAME] = this.accessTokenService.getTokenSignature(endpoint, request.method, timestamp);
      }
      request = request.clone({ setHeaders });
      return next.handle(request);
    }
  }
}
