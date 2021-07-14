import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedList } from '@api/core/model/paginated-list.interface';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  public getList<T>(endpointSubscribable: Observable<HttpResponse<T[]>>): Observable<PaginatedList<T>> {
    return endpointSubscribable.pipe(
      map((r: HttpResponse<T[]>) => {
        const nextPage: string = r.headers.get('x-nextpage');
        return {
          list: r.body,
          paginationParameter: nextPage ? nextPage.replace('init=', '') : null,
        };
      })
    );
  }
}
