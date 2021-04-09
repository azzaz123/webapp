import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FavoritesResponse } from './favorites-api.interface';

export const GET_FAVORITES = `${environment.baseUrl}api/v3/items/check-favorites`;

@Injectable()
export class FavoritesApiService {
  constructor(private http: HttpClient) {}

  public getFavoriteItemsId(itemIds: string[]): Observable<string[]> {
    return this.http
      .post<FavoritesResponse>(GET_FAVORITES, { ids: itemIds })
      .pipe(
        map((response) => response.favorites),
        catchError(() => of([]))
      );
  }
}
