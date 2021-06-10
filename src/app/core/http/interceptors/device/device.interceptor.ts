import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export const DEVICE_HEADER_NAME = 'DeviceOS';
export enum DEVICE_OS {
  WEB,
  ANDROID,
  IOS,
}
@Injectable()
export class DeviceInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isMonolithRequest = request.url.startsWith(environment.baseUrl);

    if (isMonolithRequest) {
      const setHeaders = {
        [DEVICE_HEADER_NAME]: DEVICE_OS.WEB.toString(),
      };

      request = request.clone({ setHeaders });
    }

    return next.handle(request);
  }
}
