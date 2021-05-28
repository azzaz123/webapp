import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

export abstract class ErrorMapper {
  constructor(private request: HttpRequest<unknown>, private handler: HttpHandler) {}

  public map(): Observable<HttpEvent<unknown>> {
    return this.handler.handle(this.request).pipe(
      catchError((error) => {
        const generatedError = this.generateErrorByRequest(error);
        return throwError(generatedError);
      })
    );
  }

  protected generateErrorByRequest(networkError: HttpErrorResponse): Error | Error[] {
    return new Error(networkError.message);
  }
}
