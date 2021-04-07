import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { Image, UserExtrainfo, UserFavourited, UserResponse } from '@core/user/user-response.interface';
import { UserStatsResponse } from '@core/user/user-stats.interface';
import { environment } from '@environments/environment';
import { ReviewResponse, ReviewsData } from '@private/features/reviews/core/review-response.interface';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../pagination/pagination.interface';
import { PaginationService } from '../../pagination/pagination.service';
import { MarkAsFavouriteBodyResponse } from './interfaces/public-user-response.interface';

export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const USER_COVER_IMAGE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/cover-image`;
export const STATS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/stats`;
export const REVIEWS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/reviews`;
export const PUBLISHED_ITEMS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/items/published`;
export const SOLDS_ITEMS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/items/solds`;
export const TRANSACTIONS_BUYS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/transactions/buys`;
export const TRANSACTIONS_SOLDS_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/transactions/solds`;
export const GET_EXTRA_INFO_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/extra-info`;

export const FAVOURITE_API_PATH = 'favorite';
export const IS_FAVOURITE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/${FAVOURITE_API_PATH}`;
export const MARK_AS_FAVOURITE_ENDPOINT = (userId: string) => `${PROFILE_API_URL(userId)}/${FAVOURITE_API_PATH}`;

@Injectable()
export class PublicUserApiService {
  constructor(private http: HttpClient, private paginationService: PaginationService) {}

  public getStats(userId: string): Observable<UserStatsResponse> {
    return this.http.get<UserStatsResponse>(`${environment.baseUrl}${STATS_ENDPOINT(userId)}`);
  }

  public isFavourite(userId: string): Observable<UserFavourited> {
    return this.http.get<UserFavourited>(`${environment.baseUrl}${IS_FAVOURITE_ENDPOINT(userId)}`);
  }

  public getReviews(userId: string, init: number = 0): Observable<PaginationResponse<ReviewResponse>> {
    return this.paginationService.getItems(
      this.http.get<HttpResponse<ReviewsData[]>>(
        `${environment.baseUrl}${REVIEWS_ENDPOINT(userId)}`,
        this.paginationService.getPaginationRequestOptions(init)
      )
    );
  }

  public getPublishedItems(id: string, init: number = 0): Observable<PaginationResponse<ItemResponse>> {
    return this.paginationService.getItems(
      this.http.get<HttpResponse<ItemResponse[]>>(
        `${environment.baseUrl}${PUBLISHED_ITEMS_ENDPOINT(id)}`,
        this.paginationService.getPaginationRequestOptions(init)
      )
    );
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
