import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const USER_COVER_IMAGE_ENDPOINT = (userId: string) =>
  `${PROFILE_API_URL(userId)}/cover-image`;
export const FAVOURITE_API_PATH = 'favorite';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  constructor(private http: HttpClient) {}

  public getStats(userId: string): Observable<UserStats> {
    return this.http
      .get<UserStatsResponse>(
        `${environment.baseUrl}${PROFILE_API_URL(userId)}/stats`
      )
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

  public getFavourite(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/favorite`
    );
  }

  public getReviews(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/reviews`
    );
  }

  public getPublishedItems(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/items/published`
    );
  }

  public getSoldItems(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/items/solds`
    );
  }

  public getBuyTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/transactions/buys`
    );
  }

  public getSoldsTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/transactions/solds`
    );
  }

  public getUser(userId: string): Observable<User> {
    return this.http
      .get<UserResponse>(`${environment.baseUrl}${PROFILE_API_URL(userId)}`)
      .pipe(map((user) => this.mapRecordData(user)));
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
      this.isPro(data)
    );
  }
}
