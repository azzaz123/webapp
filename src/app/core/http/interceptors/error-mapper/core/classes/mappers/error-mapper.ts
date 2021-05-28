import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

export abstract class ErrorMapper {
  constructor(private request: HttpRequest<unknown>, private handler: HttpHandler) {}

  public map(): Observable<HttpEvent<unknown>> {
    return this.handler.handle(this.request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        const generatedError = this.generateErrorByRequest(errorResponse);
        const emptyError = this.generateEmptyError(generatedError, errorResponse);
        if (emptyError) {
          return throwError(emptyError);
        }
        return throwError(generatedError);
      })
    );
  }

  protected generateErrorByRequest(errorResponse: HttpErrorResponse): Error | Error[] {
    return new Error(this.getErrorMessageFromResponse(errorResponse));
  }

  private generateEmptyError(error: null | Error | Error[], errorResponse: HttpErrorResponse): Error | Error[] {
    if (!error) {
      return new Error(this.getErrorMessageFromResponse(errorResponse));
    }

    if (Array.isArray(error) && !error.length) {
      return [new Error(this.getErrorMessageFromResponse(errorResponse))];
    }
  }

  private getErrorMessageFromResponse(errorResponse: HttpErrorResponse): string {
    const { error } = errorResponse;
    const message = error[0]?.message || error?.message;
    return message || 'Error';
  }
}
