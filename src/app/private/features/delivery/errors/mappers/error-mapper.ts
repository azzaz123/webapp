import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export abstract class ErrorMapper<T extends HttpErrorResponse> {
  public static DEFAULT_ERROR_MESSAGE = 'Error';

  public map(errorResponse: T): Observable<never> {
    const generatedError = this.generateErrorByRequest(errorResponse);
    const isEmptyError = this.isGeneratedErrorEmpty(generatedError);
    if (isEmptyError) {
      const fallbackError = this.generateFallbackError(errorResponse);
      return throwError(fallbackError);
    }
    return throwError(generatedError);
  }

  protected generateErrorByRequest(errorResponse: HttpErrorResponse): Error | Error[] {
    return this.generateFallbackError(errorResponse);
  }

  private isGeneratedErrorEmpty(error: Error | Error[]): boolean {
    const isDefined = !!error;
    const isEmptyArray = Array.isArray(error) && !error.length;
    return !isDefined || isEmptyArray;
  }

  private generateFallbackError(errorResponse: HttpErrorResponse): Error | Error[] {
    const errorsFromBackend = this.getErrorMessageFromResponse(errorResponse);
    if (Array.isArray(errorsFromBackend)) {
      return errorsFromBackend.map((error) => new Error(error));
    }
    return new Error(errorsFromBackend);
  }

  private getErrorMessageFromResponse(errorResponse: HttpErrorResponse): string | string[] {
    const { error: backendError } = errorResponse;
    if (Array.isArray(backendError)) {
      return backendError.map((error) => (error.message ? error.message : ErrorMapper.DEFAULT_ERROR_MESSAGE));
    }
    return backendError?.message || ErrorMapper.DEFAULT_ERROR_MESSAGE;
  }
}
