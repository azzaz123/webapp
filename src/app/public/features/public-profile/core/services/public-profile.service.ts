import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Counters, Ratings, UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { Image, UserResponse } from '@core/user/user-response.interface';
import { MarkAsFavouriteBodyResponse } from '../interfaces/public-profile-request.interface';
import { ReviewResponse } from '@features/reviews/core/review-response.interface';
import { ItemResponse } from '@core/item/item-response.interface';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { EMPTY_STATS } from './constants/stats-constants';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';

@Injectable()
export class PublicProfileService {
  private _user: User;

  constructor(private publicUserApiService: PublicUserApiService) {}

  get user(): User {
    return this._user;
  }

  public getStats(userId: string): Observable<UserStats> {
    return this.publicUserApiService.getStats(userId).pipe(
      map((response) => {
        return {
          ratings: this.toRatingsStats(response.ratings),
          counters: this.toCountersStats(response.counters),
        };
      }),
      catchError(() => of(EMPTY_STATS))
    );
  }

  public isFavourite(userId: string): Observable<boolean> {
    return this.publicUserApiService.isFavourite(userId);
  }

  public getReviews(
    userId: string,
    init: number = 0
  ): Observable<PaginationResponse<ReviewResponse>> {
    return this.publicUserApiService.getReviews(userId, init);
  }

  public getPublishedItems(
    userId: string,
    init: number = 0
  ): Observable<PaginationResponse<ItemResponse>> {
    return this.publicUserApiService.getPublishedItems(userId, init);
  }

  public getSoldItems(userId: string): Observable<any> {
    return this.publicUserApiService.getSoldItems(userId);
  }

  public getBuyTransactions(userId: string): Observable<any> {
    return this.publicUserApiService.getBuyTransactions(userId);
  }

  public getSoldsTransactions(userId: string): Observable<any> {
    return this.publicUserApiService.getSoldsTransactions(userId);
  }

  public getUser(userId: string, useCache = true): Observable<User> {
    if (useCache && this._user) {
      return of(this._user);
    }

    return this.publicUserApiService.getUser(userId).pipe(
      map((user) => this.mapRecordData(user)),
      tap((user) => (this._user = user))
    );
  }

  public isPro(user: User | UserResponse): boolean {
    return user && user.featured;
  }

  public getCoverImage(userId: string): Observable<Image> {
    return this.publicUserApiService.getCoverImage(userId);
  }

  public markAsFavourite(
    userId: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.publicUserApiService.markAsFavourite(userId);
  }

  public unmarkAsFavourite(
    userId: string
  ): Observable<MarkAsFavouriteBodyResponse> {
    return this.publicUserApiService.unmarkAsFavourite(userId);
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
}
