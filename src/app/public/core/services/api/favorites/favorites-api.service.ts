import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { Observable } from 'rxjs';

export const GET_FAVORITES = `${environment.baseUrl}api/v3/items/check-favorites`;
@Injectable()
export class FavoritesApiService {
  constructor(private http: HttpClient) {}

  public getFavoriteItemsId(itemIds: string[]): Observable<string[]> {
    const params = { ids: itemIds };
    return this.http.get<string[]>(GET_FAVORITES, { params });
  }
}
