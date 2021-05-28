import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { UnknownErrorMapper } from './unknown/unknown-error-mapper';

export abstract class ErrorMapper {
  private error: ErrorMapper;

  constructor(private request: HttpRequest<unknown>, private handler: HttpHandler) {
    this.error = this.generateErrorByRequest(request, handler);
  }

  public map(): Observable<HttpEvent<unknown>> {
    return this.handler.handle(this.request).pipe(catchError(() => throwError(this.error)));
  }

  private generateErrorByRequest(request: HttpRequest<unknown>, handler: HttpHandler): ErrorMapper {
    return new UnknownErrorMapper(request, handler);
  }
}
