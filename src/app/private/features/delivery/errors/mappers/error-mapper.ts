import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export abstract class ErrorMapper<T extends HttpErrorResponse> {
  public map(errorResponse: T): Observable<never> {
    const generatedError = this.generateErrorByRequest(errorResponse);
    const emptyError = this.generateEmptyError(generatedError, errorResponse);
    if (emptyError) {
      return throwError(emptyError);
    }
    return throwError(generatedError);
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
