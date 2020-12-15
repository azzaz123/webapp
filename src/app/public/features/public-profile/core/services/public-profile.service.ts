import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Counters, Ratings } from '@core/user/user-stats.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Image, UserInfo, UserStats } from '../public-profile.interface';

export const PROFILE_API_URL = (userId: string) => `api/v3/users/${userId}`;
export const PROTOOL_ENDPOINT = (userId: string) =>
  `api/v3/protool/${userId}/extraInfo`;

export const USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT = (userId: string) =>
  `api/v3/users/${userId}/profile-subscription-info`;

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  constructor(private http: HttpClient) {}

  public getStats(userId: string): Observable<any> {
    return this.http
      .get<UserStats>(`${environment.baseUrl}${PROFILE_API_URL(userId)}/stats`)
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

  public getUser(userId: string): Observable<UserInfo> {
    return this.http
      .get<UserInfo>(`${environment.baseUrl}${PROFILE_API_URL(userId)}`)
      .pipe(
        map((user: UserInfo) => {
          user.isPro = this.isPro(user);
          this.getUserProfilePicture(userId).subscribe((image: Image) => {
            console.log('image => ', image);
            user.image = image;
          });
          return user;
        })
      );
  }

  public isPro(user: UserInfo): boolean {
    return user && user.featured;
  }

  public toRatingsStats(ratings): Ratings {
    return ratings.reduce(({}, rating) => {
      return { reviews: rating.value };
    }, {});
  }

  public toCountersStats(counters): Counters {
    return counters.reduce((counterObj, counter) => {
      counterObj[counter.type] = counter.value;
      return counterObj;
    }, {});
  }

  // TODO: check always returning null		Date: 2020/12/15
  private getUserProfilePicture(userId: string): Observable<Image> {
    return this.http.get<Image>(
      `${environment.baseUrl}${PROFILE_API_URL(userId)}/cover-image`
    );
  }

  public getProUserInfo(userId: string): Observable<any> {
    return this.http.get<any>(
      `${USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT(userId)}`
    );
  }
}
