import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShippingCounterResponse, UserStatsResponse } from '@core/user/user-stats.interface';
import { Image, UserExtrainfo, UserFavourited, UserResponse } from '@core/user/user-response.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { MarkAsFavouriteBodyResponse } from './interfaces/public-user-response.interface';

export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const DELIVERY_API_URL = (userId: string) => `api/v3/delivery/users/${userId}`;
export const USER_COVER_IMAGE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/cover-image`;
export const STATS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/stats`;
export const SHIPPING_COUNTER_ENDPOINT = (userId: string) => `${DELIVERY_API_URL(userId)}/transaction/statistics`;
export const SOLDS_ITEMS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/items/solds`;
export const TRANSACTIONS_BUYS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/transactions/buys`;
export const TRANSACTIONS_SOLDS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/transactions/solds`;
export const GET_EXTRA_INFO_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/extra-info`;

export const FAVOURITE_API_PATH = 'favorite';
export const IS_FAVOURITE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/${FAVOURITE_API_PATH}`;
export const MARK_AS_FAVOURITE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/${FAVOURITE_API_PATH}`;

@Injectable()
export class PublicUserApiService {
  constructor(private http: HttpClient) {}

  public getStats(userId: string): Observable<UserStatsResponse> {
    return this.http.get<UserStatsResponse>(`${environment.baseUrl}${STATS_ENDPOINT(userId)}`);
  }

  public getShippingCounter(userId: string): Observable<ShippingCounterResponse> {
    return this.http.get<ShippingCounterResponse>(`${environment.baseUrl}${SHIPPING_COUNTER_ENDPOINT(userId)}`);
  }

  public isFavourite(userId: string): Observable<UserFavourited> {
    return this.http.get<UserFavourited>(`${environment.baseUrl}${IS_FAVOURITE_ENDPOINT(userId)}`);
  }

  public getSoldItems(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${SOLDS_ITEMS_ENDPOINT(userId)}`);
  }

  public getBuyTransactions(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${TRANSACTIONS_BUYS_ENDPOINT(userId)}`);
  }

  public getSoldsTransactions(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${TRANSACTIONS_SOLDS_ENDPOINT(userId)}`);
  }

  public getUser(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.baseUrl}${PROFILE_API_URL(userId)}`);
  }

  public getCoverImage(userId: string): Observable<Image> {
    return this.http.get<Image>(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT(userId)}`);
  }

  public getExtraInfo(userId: string): Observable<UserExtrainfo> {
    return this.http.get<UserExtrainfo>(`${environment.baseUrl}${GET_EXTRA_INFO_ENDPOINT(userId)}`);
  }

  public markAsFavourite(userId: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(`${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(userId)}`, { favorited: true });
  }

  public unmarkAsFavourite(userId: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(`${environment.baseUrl}${MARK_AS_FAVOURITE_ENDPOINT(userId)}`, { favorited: false });
  }
}
