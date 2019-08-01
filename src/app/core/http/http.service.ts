import { Injectable } from '@angular/core';
import {
  ConnectionBackend,
  Headers,
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../event/event.service';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/delay';

export const SECRET = 'UTI5dVozSmhkSE1zSUhsdmRTZDJaU0JtYjNWdVpDQnBkQ0VnUVhKbElIbHZkU0J5WldGa2VTQjBieUJxYjJsdUlIVnpQeUJxYjJKelFIZGhiR3hoY0c5d0xtTnZiUT09';

@Injectable()
export class HttpService extends Http {

  constructor(backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private accessTokenService: AccessTokenService,
    private eventService: EventService) {
      super(backend, defaultOptions);
    }
    private retryOnStatuses = [0, 408, 429, 500, 502, 503, 504];
    private initialRetryInterval = 5 * 1000;
    private maxRetryInterval = 5 * 60 * 1000;
    public quitRetryMsg = 'Quit retrying';

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  public get(url: string, params?: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'GET');
    url = this.buildUrl(url, params);
    return super.get(url, options);
  }
  public getNoBase(url: string, params?: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'GET');
    params = this.toQueryString(params);
    if (params) {
      url += '?' + params;
    }
    return super.get(url, options);
  }

  public postUrlEncoded(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options = this.getOptions(options, url, 'POST');
    body = this.urlEncode(body);
    return this.post(url, body, options);
  }

  public post(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'POST');
    url = this.buildUrl(url);
    return super.post(url, body, options);
  }

  public postNoBase(url: string, body?: any, authorization?: string, passCookies?: boolean, withDelayedRetry?: boolean): Observable<Response> {
    const headers: Headers = new Headers();
    headers.append('Authorization', authorization);
    const newOptions: RequestOptions = new RequestOptions({headers: headers});
    newOptions.withCredentials = passCookies;
    return super.post(url, body, newOptions).retryWhen(error => {
      return error.flatMap((err: HttpErrorResponse, index: number) => {
        const delay = Math.min(this.initialRetryInterval * Math.pow(2, index), this.maxRetryInterval);
        if (this.retryOnStatuses.indexOf(err.status) !== -1 && withDelayedRetry) {
          if (index === 0) {
            this.eventService.emit(EventService.HTTP_REQUEST_FAILED, url);
          }
          return Observable.of(err.status).delay(delay);
        }
        return Observable.throw(err);
      })
      .take(100)
      .concat(Observable.throw({ message: this.quitRetryMsg, url: url })
      );
    });
  }

  public put(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'PUT');
    url = this.buildUrl(url);
    return super.put(url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'DELETE');
    url = this.buildUrl(url);
    return super.delete(url, options);
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'PATCH');
    url = this.buildUrl(url);
    return super.patch(url, body, options);
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'HEAD');
    url = this.buildUrl(url);
    return super.head(url, options);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options, url, 'OPTIONS');
    url = this.buildUrl(url);
    return super.options(url, options);
  }

  private buildUrl(url: string, params?: any): string {
    url = environment.baseUrl + url;
    params = this.toQueryString(params);
    if (params) {
      url += '?' + params;
    }
    return url;
  }

  private urlEncode(obj: Object): string {
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    for (const key in obj) {
      /* istanbul ignore else  */
      if (obj.hasOwnProperty(key)) {
        urlSearchParams.append(key, obj[key]);
      }
    }
    return urlSearchParams.toString();
  }

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

  private toQueryString(params: any) {
    let encodedStr = '';
    for (const key in params) {
      /* istanbul ignore else  */
      if (params.hasOwnProperty(key)) {
        if (encodedStr && encodedStr[encodedStr.length - 1] !== '&') {
          encodedStr = encodedStr + '&';
        }
        const value: any = params[key];
        if (value instanceof Array) {
          for (let i = 0; i < value.length; i++) {
            encodedStr = encodedStr + key + '=' + encodeURIComponent(value[i]) + '&';
          }
        } else if (typeof value === 'object') {
          for (const innerKey in value) {
            if (value.hasOwnProperty(innerKey) && typeof value[innerKey] !== 'undefined') {
              encodedStr = encodedStr + key + '[' + innerKey + ']=' + encodeURIComponent(value[innerKey]) + '&';
            }
          }
        } else {
          if (typeof value !== 'undefined') {
            encodedStr = encodedStr + key + '=' + encodeURIComponent(value);
          }
        }
      }
    }
    if (encodedStr[encodedStr.length - 1] === '&') {
      encodedStr = encodedStr.substr(0, encodedStr.length - 1);
    }
    return encodedStr;
  }

}
