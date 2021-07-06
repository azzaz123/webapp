import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { ItemCounters, ItemResponse, ItemVisibilityFlags, Purchase } from '@core/item/item-response.interface';
import { environment } from '@environments/environment';
import { APP_LOCALE } from 'configs/subdomains.config';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteItemBodyResponse, MarkAsFavouriteBodyResponse, ReserveItemBodyResponse } from './interfaces/item-response.interface';

export const ITEMS_API_URL = (itemId: string) => `${environment.baseUrl}api/v3/items/${itemId}`;
export const MARK_AS_FAVORITE_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}/favorite`;
export const GET_ITEM_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}`;
export const GET_ITEM_COUNTERS_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}/counters`;
export const GET_ITEM_BUMP_FLAGS = (id: string) => `${ITEMS_API_URL(id)}/bump-flags`;
export const SET_ITEM_RESERVED = (id: string) => `${ITEMS_API_URL(id)}/reserve`;
export const GET_ITEM_REMAINING_TIME = (itemId: string) => `${environment.baseUrl}api/v3/web/items/${itemId}/active-purchases`;

@Injectable()
export class ItemApiService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private http: HttpClient) {}

  public getItem(id: string): Observable<ItemResponse> {
    const params = { language: this.locale };
    return this.http.get<ItemResponse>(GET_ITEM_ENDPOINT(id), { params });
  }

  public getItemCounters(id: string): Observable<ItemCounters> {
    return this.http.get<ItemCounters>(GET_ITEM_COUNTERS_ENDPOINT(id)).pipe(catchError(() => this.fallbackItemCounters()));
  }

  public getBumpFlags(id: string): Observable<ItemVisibilityFlags> {
    return this.http.get<ItemVisibilityFlags>(GET_ITEM_BUMP_FLAGS(id)).pipe(catchError(() => this.fallbackItemVisibilityFlags()));
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

  public deleteItem(id: string): Observable<DeleteItemBodyResponse> {
    return this.http.delete<ItemResponse>(GET_ITEM_ENDPOINT(id));
  }

  public reserveItem(id: string, reserved: boolean): Observable<ReserveItemBodyResponse> {
    return this.http.put(`${SET_ITEM_RESERVED(id)}`, {
      reserved,
    });
  }

  public getItemActivePurchases(id: string): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(GET_ITEM_REMAINING_TIME(id));
  }

  private fallbackItemCounters(): Observable<ItemCounters> {
    return of({ views: 0, favorites: 0, conversations: 0 });
  }

  private fallbackItemVisibilityFlags(): Observable<ItemVisibilityFlags> {
    return of({
      bumped: false,
      highlighted: false,
      urgent: false,
      country_bumped: false,
      boosted: false,
    });
  }
}
