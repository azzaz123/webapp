import { HttpParams } from '@angular/common/http';

export interface PaginationResponse<T> {
  results: T[];
  init: number;
}
export interface PaginationRequestOptions {
  observe: 'body';
  params:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
}
