import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export const DEVICE_HEADER_NAME_API_V1 = 'DeviceOS';
export const DEVICE_HEADER_NAME_API_V3 = 'X-DeviceOS';
export const API_V3 = 'api/v3/';
export const BFF = 'bff';

export enum DEVICE_OS {
  WEB,
  ANDROID,
  IOS,
}
@Injectable()
export class DeviceInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isWallapopRequest = request.url.startsWith(environment.baseUrl);
    const isApiV3 = request.url.includes(API_V3) || request.url.includes(BFF);
    const webDeviceOS = DEVICE_OS.WEB.toString();

    if (isWallapopRequest) {
      let setHeaders = {
        [DEVICE_HEADER_NAME_API_V1]: webDeviceOS,
      };

      if (isApiV3) {
        setHeaders = { ...setHeaders, ...{ [DEVICE_HEADER_NAME_API_V3]: webDeviceOS } };
      }

      request = request.clone({ setHeaders });
    }

    return next.handle(request);
  }
}
