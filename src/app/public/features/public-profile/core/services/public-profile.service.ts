import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  Counters,
  Ratings,
  UserStats,
  UserStatsResponse,
} from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { Image, UserResponse } from '@core/user/user-response.interface';
import {
  IsFavouriteBodyResponse,
  MarkAsFavouriteBodyRequest,
  MarkAsFavouriteBodyResponse,
} from '../interfaces/public-profile-request.interface';
import { Item } from '@core/item/item';
import {
  ItemProContent,
  ItemProResponse,
} from '@core/item/item-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const USER_COVER_IMAGE_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/cover-image`;
export const STATS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/stats`;
export const REVIEWS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/reviews`;
export const PUBLISHED_ITEMS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/items/published`;
export const SOLDS_ITEMS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/items/solds`;
export const TRANSACTIONS_BUYS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/transactions/buys`;
export const TRANSACTIONS_SOLDS_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/transactions/solds`;
export const FAVOURITE_API_PATH = 'favorite';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  private _user: User;

  constructor(private http: HttpClient, private uuidService: UuidService) {}

  get user(): User {
    return this._user;
  }

  public getStats(userId: string): Observable<UserStats> {
    return this.http
      .get<UserStatsResponse>(`${environment.baseUrl}${STATS_ENDPOINT(userId)}`)
      .pipe(
        map((response) => {
          return {
            ratings: this.toRatingsStats(response.ratings),
            counters: this.toCountersStats(response.counters),
          };
        })
      );
  }

  public isFavourite(userId: string): Observable<boolean> {
    return this.http
      .get(
        `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`
      )
      .pipe(
        map((isFavouriteResponse: IsFavouriteBodyResponse) => {
          return isFavouriteResponse.favorited;
        })
      );
  }

  public getReviews(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${REVIEWS_ENDPOINT(userId)}`);
  }

  public getPublishedItems(userId: string): Observable<Item[]> {
    return this.http
      .get(`${environment.baseUrl}${PUBLISHED_ITEMS_ENDPOINT(userId)}`)
      .pipe(
        map((res: ItemProResponse[]) => {
          if (res.length > 0) {
            return res.map((i: ItemProResponse) => {
              const item: Item = this.mapRecordDataPro(i);
              item.views = i.content.views;
              item.favorites = i.content.favorites;
              item.conversations = i.content.conversations;
              item.purchases = i.content.purchases ? i.content.purchases : null;
              item.km = i.content.km ? i.content.km : null;
              return item;
            });
          }
          return [];
        })
      );
  }

  public getSoldItems(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${SOLDS_ITEMS_ENDPOINT(userId)}`
    );
  }

  public getBuyTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${TRANSACTIONS_BUYS_ENDPOINT(userId)}`
    );
  }

  public getSoldsTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${TRANSACTIONS_SOLDS_ENDPOINT(userId)}`
    );
  }

  public getUser(userId: string, useCache = true): Observable<User> {
    if (useCache && this._user) {
      return of(this._user);
    }

    return this.http
      .get<UserResponse>(`${environment.baseUrl}${PROFILE_API_URL(userId)}`)
      .pipe(
        map((user) => this.mapRecordData(user)),
        tap((user) => (this._user = user))
      );
  }

  public isPro(user: User | UserResponse): boolean {
    return user && user.featured;
  }

  public getCoverImage(userId: string): Observable<Image> {
    return this.http.get<Image>(
      `${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT(userId)}`
    );
  }

  public markAsFavourite(
    userId: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`,
      { favorited: true } as MarkAsFavouriteBodyRequest
    );
  }

  public unmarkAsFavourite(
    userId: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.http.put(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`,
      { favorited: false } as MarkAsFavouriteBodyRequest
    );
  }

  private toRatingsStats(ratings): Ratings {
    return ratings.reduce(({}, rating) => {
      return { reviews: rating.value };
    }, {});
  }

  private toCountersStats(counters): Counters {
    return counters.reduce((counterObj, counter) => {
      counterObj[counter.type] = counter.value;
      return counterObj;
    }, {});
  }

  private mapRecordData(data: UserResponse): User {
    if (!data || !data.id) {
      return null;
    }

    return new User(
      data.id,
      data.micro_name,
      data.image,
      data.location,
      data.stats,
      data.validations,
      data.verification_level,
      data.scoring_stars,
      data.scoring_starts,
      data.response_rate,
      data.online,
      data.type,
      data.received_reports,
      data.web_slug,
      data.first_name,
      data.last_name,
      data.birth_date,
      data.gender,
      data.email,
      data.featured,
      data.extra_info,
      null,
      data.register_date
    );
  }

  private mapRecordDataPro(response: ItemProResponse): Item {
    const data: ItemProResponse = <ItemProResponse>response;
    const content: ItemProContent = data.content;
    return this.mapItemPro(content);
  }

  private mapItemPro(content: ItemProContent): Item {
    return new Item(
      content.id,
      null,
      content.seller_id,
      content.title,
      content.description,
      content.category_id,
      null,
      content.price,
      content.currency,
      content.modified_date,
      null,
      content.flags,
      null,
      null,
      {
        id: this.uuidService.getUUID(),
        original_width: content.image ? content.image.original_width : null,
        original_height: content.image ? content.image.original_height : null,
        average_hex_color: '',
        urls_by_size: {
          original: content.image.original,
          small: content.image.small,
          large: content.image.large,
          medium: content.image.medium,
          xlarge: content.image.xlarge,
        },
      },
      content.images,
      content.web_slug,
      content.publish_date,
      null
    );
  }
}
