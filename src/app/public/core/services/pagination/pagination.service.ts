import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  public getItems(endpointSubscribable: Observable<any>): Observable<any> {
    return endpointSubscribable.pipe(
      map((r: HttpResponse<any>) => {
        const nextPage: string = r.headers.get('x-nextpage');
        return {
          results: r.body,
          init: nextPage ? nextPage.replace('init=', '') : null,
        };
      })
    );
  }
}
