import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface PaginationResponse {
  results: any[];
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
