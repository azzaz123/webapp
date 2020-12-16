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
import { UserResponse } from '@core/user/user-response.interface';

export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const PRO_USERS_ENDPOINT = (userId: string) =>
  `api/v3/users/${userId}/extra-info`;
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
