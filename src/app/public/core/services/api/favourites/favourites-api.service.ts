import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FavouritesResponse } from './favourites-api.interface';

export const CHECK_FAVOURITES_ENDPOINT = `${environment.baseUrl}api/v3/items/check-favorites`;

@Injectable()
export class FavouritesApiService {
  constructor(private http: HttpClient) {}

  public getFavouriteItemsId(itemIds: string[]): Observable<string[]> {
    return this.http
      .post<FavouritesResponse>(CHECK_FAVOURITES_ENDPOINT, { ids: itemIds })
      .pipe(
        map((response) => response.favorites),
        catchError(() => of([]))
      );
  }
}
