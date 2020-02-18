import { Injectable } from '@angular/core';
import {Headers, RequestOptions, RequestOptionsArgs} from '@angular/http';
import {environment} from '../../../environments/environment';
import {AccessTokenService} from './access-token.service';
import {SECRET} from './http.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {

  constructor(
    private accessTokenService: AccessTokenService,
  ) { }

  public getOptions(options: RequestOptionsArgs, url: string, method: string): RequestOptions {
    const headers: Headers = new Headers();
    if (this.accessTokenService.accessToken) {
      headers.append('Authorization', 'Bearer ' + this.accessTokenService.accessToken);
      if (environment.bypass) {
        headers.append('X-Bypass-Signature', environment.bypass);
      } else {
        if (url.indexOf('v3') !== -1) {
          const timestamp = new Date().getTime();
          headers.append('Timestamp', timestamp.toString());
          headers.append('X-Signature', this.getSignature(url, method, timestamp));
        }
      }
    }
    let newOptions: RequestOptions = new RequestOptions({headers: headers});
    if (options && options.headers) {
      options.headers.forEach(function (values: string[], name: string) {
        headers.append(name, values[0]);
      });
      newOptions = (<RequestOptions>options).merge(newOptions);
    }
    if (options && options.body) {
      newOptions.body = options.body;
    }
    return newOptions;
  }

  private getSignature(url: string, method: string, timestamp: number) {
    const separator = '+#+';
    const signature = ['/' + url.split('?')[0], method, timestamp].join(separator) + separator;
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(signature, CryptoJS.enc.Base64.parse(SECRET)));
  }

}
