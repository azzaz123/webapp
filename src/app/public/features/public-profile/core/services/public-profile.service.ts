import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Counters, Ratings, ShippingCounterResponse, UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { Image, UserExtrainfo, UserFavourited, UserResponse } from '@core/user/user-response.interface';
import { MarkAsFavouriteBodyResponse } from '../interfaces/public-profile-request.interface';
import { ReviewResponse } from '@private/features/reviews/core/review-response.interface';
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

  public getShippingCounter(userId: string): Observable<number> {
    return this.publicUserApiService.getShippingCounter(userId).pipe(
      map((response: ShippingCounterResponse) => {
        return response.succeeded_count;
      }),
      catchError(() => of(0))
    );
  }

  public isFavourite(userId: string): Observable<UserFavourited> {
    return this.publicUserApiService.isFavourite(userId);
  }

  public getReviews(userId: string, init: number = 0): Observable<PaginationResponse<ReviewResponse>> {
    return this.publicUserApiService.getReviews(userId, init);
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

  public getCoverImage(userId: string): Observable<Image> {
    return this.publicUserApiService.getCoverImage(userId);
  }

  public getExtraInfo(userId: string): Observable<UserExtrainfo> {
    return this.publicUserApiService.getExtraInfo(userId);
  }

  public markAsFavourite(userId: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.publicUserApiService.markAsFavourite(userId);
  }

  public unmarkAsFavourite(userId: string): Observable<MarkAsFavouriteBodyResponse> {
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
