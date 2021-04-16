import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FavouritesResponse } from './favourites-api.interface';

export const GET_FAVOURITES = `${environment.baseUrl}api/v3/items/check-favorites`;

@Injectable({
  providedIn: 'root',
})
export class FavouritesApiService {
  constructor(private http: HttpClient) {}

  public getFavouriteItemsId(itemIds: string[]): Observable<string[]> {
    return this.http
      .post<FavouritesResponse>(GET_FAVOURITES, { ids: itemIds })
      .pipe(
        map((response) => response.favorites),
        catchError(() => of([]))
      );
  }
}
