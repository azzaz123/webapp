import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResponse } from './pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  public getItems(
    endpointSubscribable: Observable<any>
  ): Observable<PaginationResponse> {
    return endpointSubscribable.pipe(
      map((r: HttpResponse<any>) => {
        const nextPage: string = r.headers.get('x-nextpage');
        return {
          results: r.body,
          init: nextPage ? parseInt(nextPage.replace('init=', '')) : null,
        };
      })
    );
  }

  getSpecificRequestOptions(init: number) {
    return {
      params: {
        init: init || 0,
      } as any,
      observe: 'response' as 'body',
    };
  }
}
