import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NullQueryParamsInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = new HttpParams();
    request.params.keys().forEach((paramKey) => {
      const paramValue = request.params.get(paramKey);
      if (paramValue !== null) {
        params = params.append(paramKey, paramValue);
      }
    });
    request = request.clone({ params });
    return next.handle(request);
  }
}
