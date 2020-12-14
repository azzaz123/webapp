import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { UserInfo, UserStats } from '../public-profile.interface';

export const PROFILE_API_URL = 'api/v3/users/';
@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  constructor(private http: HttpClient) {}

  public getStats(userId: string): Observable<any> {
    return this.http.get<UserStats>(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/stats`
    );
  }

  public getFavourite(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/favorite`
    );
  }

  public getReviews(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/reviews`
    );
  }

  public getPublishedItems(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/items/published`
    );
  }

  public getSoldItems(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/items/solds`
    );
  }

  public getBuyTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/transactions/buys`
    );
  }

  public getSoldsTransactions(userId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/transactions/solds`
    );
  }

  public getUser(userId: string): Observable<UserInfo> {
    return this.http
      .get<UserInfo>(`${environment.baseUrl}${PROFILE_API_URL}${userId}`)
      .pipe(
        map((user: UserInfo) => {
          user.isPro = this.isPro(user);
          return user;
        })
      );
  }

  public isPro(user: UserInfo): boolean {
    return user && user.featured;
  }
}
