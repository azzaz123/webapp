import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IDictionary } from '../../shared/models/dictionary.interface';
import { IRequestOptions } from './request.options.interface';

export const DEFAULT_ERROR_MESSAGE = 'Server Error :(';

@Injectable()
export class HttpServiceNew {

  constructor(private http: HttpClient) {}

  public get<T = any>(endpoint: string, params?: IDictionary[], options: IRequestOptions = {}): Observable<T> {
      this.addParamsToOptions(params, options);

      return this.http.get<T>(environment.baseUrl + endpoint, options)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => this.catchErrorFn(errorResponse)),
          finalize(this.finalizeFn())
        );
  }

  public post<T = any>(endpoint: string, body: any = {}, params?: IDictionary[], options: IRequestOptions = {}): Observable<T> {
      this.addParamsToOptions(params, options);

      return this.http.post<T>(environment.baseUrl + endpoint, body, options)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => this.catchErrorFn(errorResponse)),
          finalize(this.finalizeFn())
        );
  }

  public put<T = any>(endpoint: string, body: any = {}, params?: IDictionary[], options: IRequestOptions = {}): Observable<T> {
      this.addParamsToOptions(params, options);

      return this.http.put<T>(environment.baseUrl + endpoint, body, options)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => this.catchErrorFn(errorResponse)),
          finalize(this.finalizeFn())
        );
  }

  public delete<T = any>(endpoint: string, params?: IDictionary[], options: IRequestOptions = {}): Observable<T> {
      this.addParamsToOptions(params, options);

      return this.http.delete<T>(environment.baseUrl + endpoint, options)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => this.catchErrorFn(errorResponse)),
          finalize(this.finalizeFn())
        );
  }

  public addParamsToOptions(params: IDictionary[], options: IRequestOptions): void {
    if (!params || params.length === 0) { return; }

    let newParams: HttpParams = new HttpParams();
    params.forEach(param => {
      if (param.value) {
        newParams = newParams.set(param.key, param.value.toString());
      }
    });
    options.params = newParams;
  }

  public catchErrorFn(errorResponse: HttpErrorResponse): Observable<never> {
    return observableThrowError(errorResponse);
  }

  public finalizeFn(): () => void {
    return () => {};
  }
}
