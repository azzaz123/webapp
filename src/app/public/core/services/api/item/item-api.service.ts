import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { MarkAsFavouriteBodyResponse } from './interfaces/item-response.interface';

export const ITEMS_API_URL = (userId: string) => `${environment.baseUrl}api/v3/items/${userId}`;
export const MARK_AS_FAVORITE_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}/favorite`;
export const GET_ITEM_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}`;

@Injectable()
export class ItemApiService {
  constructor(private http: HttpClient) {}

  public getItem(id: string): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(GET_ITEM_ENDPOINT(id));
  }

  public markAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(MARK_AS_FAVORITE_ENDPOINT(id), {
      favorited: true,
    });
  }

  public unmarkAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(MARK_AS_FAVORITE_ENDPOINT(id), {
      favorited: false,
    });
  }
}
