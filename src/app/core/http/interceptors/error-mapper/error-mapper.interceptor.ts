import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorMapperFactory } from './core/functions/error-mapper-factory';

@Injectable()
export class ErrorMapperInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const errorMapper = ErrorMapperFactory(request, next);
    if (errorMapper) {
      return errorMapper.map();
    }

    return next.handle(request);
  }
}
