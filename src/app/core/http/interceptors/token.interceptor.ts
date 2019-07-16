import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import { AccessTokenService } from '../access-token.service';
import { environment } from '../../../../environments/environment';

export const TOKEN_AUTHORIZATION_HEADER_NAME = 'Authorization';
export const TOKEN_TIMESTAMP_HEADER_NAME = 'Timestamp';
export const TOKEN_SIGNATURE_HEADER_NAME = 'X-Signature';
export const SECRET =
  'UTI5dVozSmhkSE1zSUhsdmRTZDJaU0JtYjNWdVpDQnBkQ0VnUVhKbElIbHZkU0J5WldGa2VTQjBieUJxYjJsdUlIVnpQeUJxYjJKelFIZGhiR3hoY0c5d0xtTnZiUT09';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private accessTokenService: AccessTokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.accessTokenService.accessToken) {
      const setHeaders: any = {};
      setHeaders[TOKEN_AUTHORIZATION_HEADER_NAME] = `Bearer ${this.accessTokenService.accessToken}`;

      if (request.url.indexOf('v3') !== -1) {
        const timestamp = new Date().getTime();
        const endpoint = request.url.replace(environment.baseUrl, '');
        setHeaders[TOKEN_TIMESTAMP_HEADER_NAME] = timestamp.toString();
        setHeaders[TOKEN_SIGNATURE_HEADER_NAME] = this.getSignature(endpoint, request.method, timestamp);
      }
      request = request.clone({setHeaders});
    }

    return next.handle(request);
  }

  public getSignature(url: string, method: string, timestamp: number) {
    const separator = '+#+';
    const signature = ['/' + url.split('?')[0], method, timestamp].join(separator) + separator;
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(signature, CryptoJS.enc.Base64.parse(SECRET)));
  }
}
